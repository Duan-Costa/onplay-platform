import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_ONPLAY_METADATA_URL;
  if (!url) return NextResponse.json({ title: '', artist: '' }, { status: 200 });
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ title: '', artist: '' }, { status: 502 });
    const data = await response.json();
    return NextResponse.json({
      title: data.title ?? data.song ?? data.now_playing?.song ?? '',
      artist: data.artist ?? data.now_playing?.artist ?? '',
      cover: data.cover ?? data.artwork ?? data.now_playing?.artwork ?? ''
    });
  } catch {
    return NextResponse.json({ title: '', artist: '' }, { status: 502 });
  }
}
