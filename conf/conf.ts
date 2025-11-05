const conf = {
    nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.warn('NEXT_PUBLIC_BASE_URL is not set, using default: http://localhost:3000');
}

export default conf;