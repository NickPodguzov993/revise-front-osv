export async function fetcher<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON | string> {



        const res = await fetch(input, init);
        if( res.status === 403 || res.status !== 200) {
            throw {code: res.status}
        }
        return res.json();

}
