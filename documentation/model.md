# Software Subscription and License Management System - Data Model

## License

License represents a both license contract and end user license token or end user subscription.

```
{
        "id": "db040c31-8694-4d37-aab4-75c26326e954",
        "company": "Microsoft",
        "contract": {
            "address": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
            "blockchain": "ETHEREUM",
            "type": "PERPETUAL"
        },
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "name": "Microsoft Office - Premimum",
        "owner": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "price": "10000000000000000",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "software": "Microsoft Office",
        "status": "ACTIVE",
        "type": "CONTRACT_PERPETUAL"
    }
```

```
{
        "id": "db040c31-8694-4d37-aab4-75c26326e954",
        "company": "Microsoft",
        "contract": {
            "address": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
            "blockchain": "ETHEREUM",
            "type": "PERPETUAL"
        },
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "name": "Microsoft Office - Premimum",
        "owner": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "price": "10000000000000000",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "software": "Microsoft Office",
        "status": "ACTIVE",
        "type": "CONTRACT_FIXED_SUBSCRIPTION",
        "subscriptionPeriod": "1000",
    }
```

```
{
        "id": "db040c31-8694-4d37-aab4-75c26326e954",
        "company": "Microsoft",
        "contract": {
            "address": "0x26daFAC779d8434CD339682d3550e4815c98AB4D",
            "blockchain": "ETHEREUM",
            "type": "PERPETUAL"
        },
        "description": "Premimum package for the microsoft office 2003. License valid",
        "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
        "name": "Microsoft Office - Premimum",
        "owner": "0x0c81414f8545522A0C97A39F83700De8230825b6",
        "price": "10000000000000000",
        "metadata":"https://ipfs.io/ipfs/QmZmX5iTJc3C98dbkwrHMJsTGATduYNHCUmqpz7t4iSQpW",
        "software": "Microsoft Office",
        "status": "ACTIVE",
        "type": "CONTRACT_FIXED_SUBSCRIPTION",
        "subscriptionPeriod": "1000",
        "paymentToken": "1000",
    }
```

- `id` (uuidv4, immutable) is a unique identifier for the license within the system.
- `software` (uuidv4, optional) is the id of the software that the license belongs to.
- `type` (string, enum) represents the type of the license. Possible values are;
  - CONTRACT_PERPETUAL - license is a contract of perpetual license
  - CONTRACT_FIXED_SUBSCRIPTION - license is a contract to create fixed subscription
  - CONTRACT_AUTO_RENEW_SUBSCRIPTION - license is a contract to create auto renew subscription
- `name` (string) is the name of the license.
- `price` (string) price of the license in wei.
- `description` (string) is a description of the license.
- `image` (string, url) is a URL that contains an image representing the license.
- `status` (string, enum) represents the current status of the license. Possible values are;
  - ACTIVE - License is active and should be visible to customers
  - INACTIVE - License is inactive and should not be visible to customers
- `owner` (address) is the id of the user that owns the license.
- `metadata` (string,url) ipfs link of the license contract.
- `subscriptionPeriod` (string, optional) subscription period in seconds for subscription type of license.
- `paymentToken` (address, optional) payment token for auto renew subscription.
- `contract` (object, optional) represents the contract associated with this license. It has the following properties.
  - `blockchain` (string, enum) is the blockchain hosting the contract. Possible values are;
    - ETHEREUM - Ethereum
  - `address` (string, address) is the address of the contract.
  - `type` (string, enum) is the type of the contract. Possible values are;
    - PERPETUAL
    - AUTO_RENEW_SUBSCRIPTION
    - FIXED_SUBSCRIPTION

## Software

Software represents set of license related to one software.

```

{
        "id": "bd7b7740-3f44-4238-a834-4606621b6ba6",
        "category": "APPLICTION",
        "name": "Microsoft Word 2016",
        "description": "Microsoft Word 2016 software for document editing",
        "image": "https://i0.wp.com/isoriver.com/wp-content/uploads/2019/11/word-2016.jpg?w=920&ssl=1",
        "owner": "a0310c2a-ca87-421e-9235-dfadf323b412",
}

```

- `id` (uuidv4, immutable) is the unique identifier of the software.
- `category` (string, enum) is the category of the software. Possible values are;
  - SYSTEM - System Software
  - APPLICTION - Application Software
- `name` (string) is the name of the software.
- `description` (string) is the description of the software.
- `image` (string, url) is a URL containing an image representing the software.
