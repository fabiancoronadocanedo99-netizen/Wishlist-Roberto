import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    const payload = await req.text();
    const signature = req.headers.get('Stripe-Signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET! // Add this to local env for prod
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;

        // Retrieve metadata
        const metadata = session.metadata;

        if (metadata && metadata.productId) {
            try {
                // 1. Insert into donations table
                const { error: donationError } = await supabaseAdmin.from('donations').insert({
                    stripe_session_id: session.id,
                    product_id: metadata.productId,
                    donor_name: metadata.donorName,
                    donor_email: metadata.donorEmail,
                    amount_paid: parseFloat(metadata.amount),
                    currency: metadata.currency,
                    status: 'completed',
                    dedication_message: metadata.dedication || null,
                    show_on_wall: true,
                });

                if (donationError) {
                    throw new Error(`Failed to log donation: ${donationError.message}`);
                }

                // 2. Increment quantity_funded in products table
                // We do a select first, then update (or RPC if configured)
                const { data: product } = await supabaseAdmin
                    .from('products')
                    .select('quantity_funded, name_es')
                    .eq('id', metadata.productId)
                    .single();

                if (product) {
                    await supabaseAdmin
                        .from('products')
                        .update({ quantity_funded: product.quantity_funded + 1 })
                        .eq('id', metadata.productId);
                }

                // 3. Send Notification Email via Resend
                await resend.emails.send({
                    from: 'Wishlist Roberto <onboarding@resend.dev>', // Update for production verified domain
                    to: [process.env.BENEFICIARY_EMAIL!, metadata.donorEmail],
                    subject: `¡Nuevo Padrino para: ${product?.name_es}!`,
                    html: `
            <div style="font-family: sans-serif; color: #333;">
              <h2>¡Un nuevo regalo ha sido aportado!</h2>
              <p><strong>Padrino/Madrina:</strong> ${metadata.donorName}</p>
              <p><strong>Monto:</strong> ${metadata.currency} ${metadata.amount}</p>
              ${metadata.dedication ? `<p><strong>Mensaje:</strong> "${metadata.dedication}"</p>` : ''}
              <hr/>
              <p>Gracias por ser parte de este camino hacia la ordenación de Roberto.</p>
            </div>
          `
                });

                return NextResponse.json({ received: true });

            } catch (err: any) {
                console.error('Error processing webhook:', err);
                return NextResponse.json({ error: 'Database or Email integration failed' }, { status: 500 });
            }
        }
    }

    // Acknowledge receipt of other event types
    return NextResponse.json({ received: true });
}
