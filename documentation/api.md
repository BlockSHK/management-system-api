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

**POST** `/query/license`

Request - Query All

```
{
    "offset": <offset>,
    "limit": <limit>
}
```

Request - Query by License Id

```
{
    "offset": <offset>,
    "limit": <limit>,
    "filter": {
        "id": "e5a3sdfc-3b19-4856-9df9-12f30de47f1d"
    }
}
```

Request - Query by Software Id

```
{
    "offset": <offset>,
    "limit": <limit>,
    "filter": {
        "software": "sdfs7740-3f44-4238-a834-4606621b6ba6"
    }
}
```

- `offset` (object, optional) is used for specifying the starting record offset for paginated queries (default is 0).

  - `id` (uuidv4) license identifier of the last queried license.
  - `software` (uuidv4) software identifier of the last queried license.

- `limit` (number, optional) is used for limiting the number of records in the result set for paginated queries (default is 100).
- `filter` (object, optional) specifies record filter criteria. Possible filter criteria are;
  - `id` (uuidv4) filters license by matching license identifier.
  - `software` (uuidv4) filters license by matching software identifier.
  - `owner` (uuidv4) filters license by matching owner identifier.

Response

```
{
    "count": <record-count>,
    "offset": <first-record-offset>,
    "limit": <record-limit>,
    "records": [
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
        "owner": "0xAa62006DcB8Ea5e90Ec241FA33768aa8c4887a34"
    },
        ...
    ]
}
```

- `count` is the total number of records (without applying pagination limits).
- `offset` is the record offset of the first record in the returned results.
  - `id` (uuidv4) license identifier.
  - `software` (uuidv4) software identifier.
- `limit` is the limit applied to trim records in the returned results.
- `records` is the list of matching results. Each record has the structure of an license as described in the data model.

Note that by default the license in the result set are sorted by `name` (ascending).

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
        "expireTime": "1687343544"
    },
    "timestamp": 1640325832000
}
```

- `actvate` return the success of activation request.
- `credential` return the details associated with the license.
  - `expireTime` (epoch) expiration time.
- `timestamp` timestamp of the response generated can use for security.
