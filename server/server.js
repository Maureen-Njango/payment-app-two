


import express, { response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import https from 'https';
import url from 'url';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const QUIKK_URL = "https://tryapi.quikk.dev/v1/mpesa/charge";
const DATE_HEADER = "date";
const CREDENTIALS = {
    "key": "61631550f79d0fad45a47cbfcda29336",
    "secret": "493b2e18d99094883a261df079d603a4"
};

function generateHmacSignature() {
    const timestamp = new Date().toUTCString();
    const toEncode = `${DATE_HEADER}: ${timestamp}`;

    const hmac = crypto
        .createHmac("SHA256", CREDENTIALS.secret)
        .update(toEncode)
        .digest();
    const encoded = Buffer.from(hmac).toString("base64");
    const urlEncoded = encodeURIComponent(encoded);

    const authString = `keyId="${CREDENTIALS.key}",algorithm="hmac-sha256",headers="${DATE_HEADER}",signature="${urlEncoded}"`;

    return [timestamp, authString];
}

function makePostRequest(body) {
    return new Promise((resolve, reject) => {
        const [timestamp, authString] = generateHmacSignature();
        const parsedUrl = url.parse(QUIKK_URL);

        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.api+json",
                [DATE_HEADER]: timestamp,
                Authorization: authString,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const response_data = JSON.parse(data);
                    resolve(response_data);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.write(JSON.stringify(body));
        req.end();
    });
}

app.post('/api/mpesa/charge', async (req, res) => {
    try {
        const { amount, phone, paybill, reference } = req.body;

        const requestBody = {
            "data": {
                "id": "gid",
                "type": "charge",
                "attributes": {
                    "amount": parseFloat(amount),
                    "posted_at": new Date().toISOString(),
                    "reference": reference,
                    "short_code": paybill,
                    "customer_no": phone,
                    "customer_type": "msisdn"
                }
            }
        };

        const response_data = await makePostRequest(requestBody);
        console.log('API response: ', response_data)
        res.json(response_data);
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



















// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import crypto from 'crypto';
// import https from 'https';
// import morgan from 'morgan';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// const QUIKK_URL = "https://tryapi.quikk.dev/v1/mpesa/charge";
// const DATE_HEADER = "date";

// const CREDENTIALS = {
//     key: process.env['QUIKK_API_KEY'],
//     secret: process.env['QUIKK_API_SECRET']
// };

// /**
//  * Generates an HMAC signature for Quikk API authentication.
//  */
// function generateHmacSignature(): [string, string] {
//   const timestamp = new Date().toUTCString();
//   const toEncode = `${DATE_HEADER}: ${timestamp}`;

//   // Ensure CREDENTIALS.secret is defined before proceeding
//   if (!CREDENTIALS.secret) {
//       throw new Error("Secret key is missing");
//   }

//   const hmac = crypto
//       .createHmac("SHA256", CREDENTIALS.secret)
//       .update(toEncode)
//       .digest();

//   const encoded = Buffer.from(hmac).toString("base64");
//   const urlEncoded = encodeURIComponent(encoded);

//   return [
//       timestamp,
//       `keyId="${CREDENTIALS.key}",algorithm="hmac-sha256",headers="${DATE_HEADER}",signature="${urlEncoded}"`
//   ];
// }


// /**
//  * Handles STK push payment requests.
//  */
// app.post('/api/v1/mpesa/charge', async (req: Request, res: Response) => {
//     try {
//         const [timestamp, authString] = generateHmacSignature();

//         const options = {
//             hostname: 'tryapi.quikk.dev',
//             port: 443,
//             path: '/v1/mpesa/charge',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/vnd.api+json',
//                 [DATE_HEADER]: timestamp,
//                 'Authorization': authString
//             }
//         };

//         const quikkReq = https.request(options, (quikkRes) => {
//             let data = '';

//             quikkRes.on('data', (chunk) => {
//                 data += chunk;
//             });

//             quikkRes.on('end', () => {
//                 res.status(quikkRes.statusCode || 500).json(JSON.parse(data));
//             });
//         });

//         quikkReq.on('error', (error) => {
//             console.error('Error:', error);
//             res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//         });

//         quikkReq.write(JSON.stringify(req.body));
//         quikkReq.end();
//     } catch (error) {
//         console.error('Payment Error:', error);
//         res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//     }
// });

// const PORT = process.env['PORT'] || 3000;
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
