

export function validateJwtToken(token: string | null): boolean {
    if (!token) 
        return false;

    const parts = token.split('.');
    
    if (parts.length !== 3) 
        return false;

    try {
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        return payload.exp > currentTime;
    }

    catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
}
