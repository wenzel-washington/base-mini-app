import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { isAddress } from 'viem';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CRYPTAINE_BASE_URL = process.env.NEXT_PUBLIC_CRYPTAINE_BASE_URL || 'https://cryptaine.com';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || !isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid or missing wallet address.' },
        { status: 400 }
      );
    }

    const HASH_NAME = 'affiliate_links';

    // Check if address already has a code
    let code = await redis.hget(HASH_NAME, address);

    if (!code) {
      // Generate a new unique code
      code = nanoid(10);
      // Store the new mapping
      await redis.hset(HASH_NAME, { [address]: code });
    }

    const trackingUrl = `${CRYPTAINE_BASE_URL}/trace/${code}`;
    return NextResponse.json({ trackingUrl });

  } catch (error) {
    console.error('Error generating tracking link:', error);
    return NextResponse.json(
      { error: 'Failed to generate tracking link.' },
      { status: 500 }
    );
  }
} 