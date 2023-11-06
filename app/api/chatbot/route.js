import {NextResponse} from "next/server";
import OpenAI from 'openai';
const openai = new OpenAI();

const messages = [
    {
        role: 'system',
        content: "You're Stitch, always answer like he would do when he's angry."
    },
];

export async function GET() {
    return NextResponse.json('GET Working')
}

export async function POST(request) {
    const data = await request.json();
    if (!data.message) return NextResponse.error(new Error('Missing text'), {status: 400});

    messages.push({role: 'user', content: data.message});
    console.log({messages})

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
    });

    const answer = completion.choices[0].message;
    messages.push(answer);

    return NextResponse.json(answer.content)
}