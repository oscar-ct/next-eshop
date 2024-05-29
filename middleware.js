// export {default} from "next-auth/middleware";
import { NextResponse } from 'next/server';

export function middleware(request) {
    // conditional statement

    // if (request.nextUrl.pathname.startsWith('/dashboard')) {
    //     return NextResponse.rewrite(new URL('/login', request.url))
    // }
    return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
    matcher: ["/dashboard"]
}