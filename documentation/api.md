# Software Subscription and License Management System - API

All API end-points described below have the `https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Stage/` prefix attached to the URI. APIs are accessible only if you relevant access key for the aws account.

All successful responses return with HTTP status code 200. Field level details of entities returned on responses can be found in the [data model](model.md).

All failed responses return with the appropriate HTTP response code, and has the following body.

Error

```
{
    "error": <message>
}
```

- `error` (stirng) gives a human readable error message.

## License

**POST** `/create`

Request

```
{
        "id": "30d069d1-26be-47cb-8ea8-9df3fb602c92",
        "type": "CONTRACT_PERPETUAL",
        "name": "Microsoft Office - Premimum",
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "status": "ACTIVE",
        "company": "Google",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "price": "10000000000000000"
}
```

Response

```
{
    "status": "OK",
    "payload": {
        "id": "30d069d1-26be-47cb-8ea8-9df3fb602c92",
        "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
        "type": "CONTRACT_PERPETUAL",
        "name": "Microsoft Office - Premimum",
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "status": "ACTIVE",
        "company": "Google",
        "price": "10000000000000000",
        "owner": "0xAa62006DcB8Ea5e90Ec241FA33768aa8c4887a34"
    }
}
```

**POST** `/deploy/{id}`

Request

```
{
        "id": "30d069d1-26be-47cb-8ea8-9df3fb602c92",
        "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
        "type": "CONTRACT_PERPETUAL",
        "name": "Microsoft Office - Premimum",
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "status": "ACTIVE",
        "company": "Google",
        "price": "10000000000000000",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "owner": "0xAa62006DcB8Ea5e90Ec241FA33768aa8c4887a34",
        "contract": {
            "blockchain": "ETHEREUM"
        }
}
```

Response

```
{
    "status": "OK",
    "payload": {
        "id": "db040c31-8694-4d37-aab4-75c26326e954",
        "company": "Google",
        "contract": {
            "address": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
            "blockchain": "ETHEREUM"
        },
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "name": "Microsoft Office - Premimum",
        "owner": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "price": "10000000000000000",
        "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
        "status": "ACTIVE",
        "type": "CONTRACT_PERPETUAL"
    }
}
```

**POST** `/purchase/{id}`

Request

```
{
        "address": "0x0c81414f8545522A0C97A39F83700De8230825b6"
}
```

Response

```
{
    "status": "OK",
    "payload": {
        "id": "db040c31-8694-4d37-aab4-75c26326e954",
        "company": "Google",
        "contract": {
            "address": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
            "blockchain": "ETHEREUM",
            "name": "PerpetualLicense",
            "royalty": "0.01",
            "type": "PERPETUAL"
        },
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "name": "Microsoft Office - Premimum",
        "owner": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "price": "10000000000000000",
        "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
        "status": "ACTIVE",
        "type": "TOKEN_PERPETUAL"
    }
}
```

## Activation

The activation process of the license happened using these two endpoints.

**POST** `/activation/nonce`

Request

```
{
    "address": "0x96dc73c8b5969608c77375f085949744b5177660"
}
```

- The `account` the account of the user which have the token of the given license.

Response

```
{
    "status": "OK",
    "payload": {
        "nonce": "dec9fd6d1fec9af30f8600f911a63012",
        "address": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "timestamp": 1678715480055
    }
}
```

**POST** `/activation/activate`

Request

```
{
    "address": "0x96dc73c8b5969608c77375f085949744b5177660",
    "contract": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
    "tokenId": "1",
    "nonce": "e3KS432Ds",
    "sign": "cdcscDl7678cssc93SDKMknkdc32kmkmkmJKDs"
}
```

- The `account` the account of the user which have the token of the given license.
- The `contract` is the address of the license contract
- The `tokenId` is the ID of the token give account have
- The `nonce` nonce sent from the back-end
- The `sign` nonce signed with the user's private key

Response

```
{
    "activate": "true",
    "credential": {

    },
    "timestamp": 1640325832000
}
```
