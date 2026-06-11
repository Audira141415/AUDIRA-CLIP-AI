import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia',
});

@Controller('billing')
export class AppController {
  
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { planId: string, teamId: string }) {
    // In production, fetch price ID from DB based on planId
    const priceId = data.planId === 'PRO' ? 'price_pro_123' : 'price_starter_123';
    
    console.log(`Creating Stripe session for Team: ${data.teamId}`);
    return {
      sessionId: 'cs_test_a1b2c3d4e5f6',
      url: 'https://checkout.stripe.com/pay/cs_test_mock'
    };
  }

  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    // Handle Stripe webhooks (e.g., invoice.payment_succeeded)
    console.log('Received Stripe Webhook');
    return { received: true };
  }
}
