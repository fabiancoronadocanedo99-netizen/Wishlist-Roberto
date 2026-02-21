import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, donorName, donorEmail, dedication, currency, amount } = body;

        if (!productId || !donorName || !donorEmail || !currency || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Retrieve the product info from Supabase to ensure security and prevent tampered amounts
        const { data: product, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Verify amount roughly matches
        const expectedAmount = currency === 'MXN' ? product.price_mxn : currency === 'USD' ? product.price_usd : product.price_eur;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: donorEmail,
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Apoyo Sacerdotal: ${product.name_es}`,
                            description: dedication ? `Dedicatoria: ${dedication}` : 'Donación para la ordenación de Roberto',
                            images: product.image_url ? [product.image_url] : [],
                        },
                        unit_amount: Math.round(expectedAmount * 100), // Stripe works in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?canceled=true`,
            metadata: {
                productId,
                donorName,
                donorEmail,
                dedication: dedication || '',
                currency,
                amount: expectedAmount.toString(),
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
