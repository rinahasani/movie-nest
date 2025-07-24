import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function GET() {
  const file = resolve('./swagger.yaml');
  const yaml = readFileSync(file, 'utf8');
  return new NextResponse(yaml, {
    headers: { 'Content-Type': 'application/x-yaml' }
  });
}
