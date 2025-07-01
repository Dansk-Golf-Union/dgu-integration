---
id: member-lookup
title: Fetching member information
sidebar_label: Member lookup
---
# Introduction

The Union Database holds information related to golf clubs and their members.

## Document Audience

This document is for apps who needs to fetch updated member (handicap) information.

## Definitions

There are a few definitions worth knowing about.

**Club**  
A golf club has an official name, a short name, a number, and possibly an address.

**Member**  
A member is a person with one or more memberships. This means that the same person can have two or more memberships of different golf clubs.

## Data format

The data format used for exchanging data through the API is JSON.

## Authentication

Access to the API is done through **Basic Authentication**. Each vendor will be given an API account with a username and password. Each account is authorized to use a certain set of API resources.

## API Set

All requests to the API must include an **API Set** in the URL. The API Set is equal to the **username** of the account unless otherwise instructed.

## Base URL

The base urls for DGU is 
- dgubasen.api.union.golfbox.io
- test-dgubasen.api.union.golfbox.io

## Request headers

All requests to the API must include the following headers:

```
Content-Type: application/json
Accept: application/json
Authorization: Basic <username:password>
Token: <OAuth token>
```

The `username:password` combination must be **Base64 encoded**.

## Token

The token for an API with player information is retrieved through the OAuth 2.0 Authorization Code Flow with PKCE. After the user logs in and grants consent, your application receives an authorization code. This code must then be exchanged for an access token via the token endpoint.

Once retrieved, the access token must be used to retrieve informaton regarding the player in question.

The token grants access based on the scopes requested during authorization (e.g. get_player.information). Be sure to store and transmit the token securely. If needed, refresh the token depending on the lifetime returned in the response.

For more details about OAuth authentication, refer to the [OAuth Guide](./oauth-guide).

## Error Handling

If a request fails, the API responds with standard HTTP error codes and messages.

Example:

```http
HTTP/1.1 500 Internal Server Error
```

## Members

Every person in the database has an ID called LifeTimeID. The format of this number is [xxxxxx-xxx], where
the first 6 are based on the persons birthdate, and the last 3 are an increment integer grouped by
birthdate.

A person can be a member of a golf club. The relationship between a person and club is a membership. A
person can also be a member of more than one club, thus having multiple memberships.
Being a member in a golf club means that you get a member number, which is unique within the club. This
member number has nothing to do with the lifetime ID. If we put together the official club number and the
member number, we have a nationally unique reference for a member. This combination is called the
‘union ID’

When a member is looked up the complete information including the person and all memberships is returned.

Here is a list of the member info.


| Name             | Type    | Nullable | Remarks                                                                 |
|------------------|---------|----------|-------------------------------------------------------------------------|
| ID               | GUID    | No       | Database ID                                                             |
| LifeTimeID       | String  | No       | 12-digit number                                                         |
| FirstName        | String  | No       |                                                                         |
| LastName         | String  | No       |                                                                         |
| Gender           | String  | No       | Male or Female                                                          |
| BirthDate        | String  | No       | The official birth date (Format: yyyymmddThhnnss)                       |
| RightToPlay      | Boolean | No       | Indicates if the player has a national playing right                    |
| Status           | Int     | No       | 1 = Amateur, 2 = Professional                                           |
| Handicap         | Decimal | No       | Official handicap index                                                 |
| HandicapStatus   | Boolean | No       | 1 = Active, (others to be decided depending on new WHS)                 |
| Memberships      | [List]  |          |                                                                         |
| └─ ID            | GUID    | No       | Database ID                                                             |
| └─ IsHomeClub     | Boolean | No       | Indicates if the membership is the home club membership                |
| └─ LocalRightToPlay | Boolean | No   | Indicates if the player has a local playing right                        |
| └─ Type          | Int     | No       | 1 = Active, 7 = Former                                                  |
| └─ UnionID       | String  | No       | Combination of the Club Number and the Member Number, e.g. 88-534       |
| └─ Club          | Object  |          | Club info of the membership club                                        |
|    └─ ID         | GUID    | No       | Database ID of the club                                                 |
|    └─ Name       | String  | No       | Official name of the club                                               |
|    └─ ShortName  | String  | No       | Short version of the club name                                          |
|    └─ UnionNumber| Int     | No       | Official club number                                                    |
| └─ HomeClub      | Object  |          | Club info about the home club (same as membership club if IsHomeClub)   |
|    └─ ID         | GUID    | No       | Database ID of the club                                                 |
|    └─ Name       | String  | No       | Official name of the club                                               |
|    └─ ShortName  | String  | No       | Short version of the club name                                          |
|    └─ UnionNumber| Int     | No       | Official club number                                                    |


### How do I look up member info?

This is dependent on your access level and agreement. 
1. If you represent a given golf club and have been given access to all members without their consent by the club, then you can look up members in that (or those) club(s). 
2. If you are an independent actor you will need player consent to access their information. That is given through the OAuth login and accompanying token - refer to the [OAuth Guide](./oauth-guide). 

### Re point 1: Access to all club members. 

You can get info about a specific member in a club you are certified to access by making the following API request.
You can refer to the member by
• lifetimeID
• unionID

**Example Request**

```
GET https://<base_url>/<apiset>/Clubs/Golfer?lifetimeID=300191-001?unionID=202-331
```

**Example Response:**

```json
{
"ID": "86A8D54D-4B90-4145-9583-0B1CD2766869",
"LifeTimeID": "300191-001",
"FirstName": "Nikolaj Bille",
"LastName": "Nielsen",
"Gender": "Male",
"BirthDate": "19910130T000000",
"RightToPlay": true,
"Status": 1,
"PlayerStatus": 1,
"Handicap": "340000",
"HandicapStatus": 1,
"Memberships": [
{
"ID": "ADF707B0-AA02-408E-9687-B41AEA0DFDE7",
"IsHomeClub": true,
"LocalRightToPlay": true,
"Type": 1,
"UnionID": "202-331",
"HomeClub": {
"ID": "ADABD19C-D1EA-45CE-AF2B-8F5407D000A6",
"Name": "Lübker Golf Klub",
"ShortName": "",
"UnionNumber": 202
},
"Club": {
"ID": "ADABD19C-D1EA-45CE-AF2B-8F5407D000A6",
"Name": "Lübker Golf Klub",
"ShortName": "",
"UnionNumber": 202
}
}
]
}
```
### Re point 2: Player lookup by unique token. 

You can retrieve information about a specific member who has granted consent by using the token obtained during the authentication process. This is done via the following API.

**Example Request**

```
GET https://<base_url>/<apiset>/clubs/Golfer_ByAccessToken
```

**Required Headers**

- `Authorization: Basic <username:password>`
- `Token: <access_token>`

**Example Response:**


```json
{
    "ID": "209A4387-F75A-4C32-B4F2-01DF6FD2996D",
    "LifeTimeID": "010182-008",
    "FirstName": "Ingenium",
    "LastName": "Test III",
    "Gender": "Male",
    "BirthDate": "19800101T000000",
    "Email": "nih@dgu.org",
    "RightToPlay": true,
    "Status": 1,
    "PlayerStatus": 1,
    "Handicap": "520000",
    "HandicapStatus": 3,
    "HandicapDato": "20210111T104421",
    "Memberships": [
        {
            "ID": "08D1CC55-2AF1-45C2-8BB4-765A0E1B24D6",
            "IsHomeClub": true,
            "LocalRightToPlay": true,
            "Type": 1,
            "UnionID": "1016-102",
            "HomeClub": {
                "ID": "7AABAF90-9155-4552-889B-553D5CE75FC6",
                "Name": "DGU Test Club A II",
                "ShortName": "DGUA",
                "Union": 1,
                "UnionNumber": 1016
            },
            "Club": {
                "ID": "7AABAF90-9155-4552-889B-553D5CE75FC6",
                "Name": "DGU Test Club A II",
                "ShortName": "DGUA",
                "Union": 1,
                "UnionNumber": 1016
            }
        }
    ]
}
```


## How do I see all available APIs?

Log in with your username and password here:

https://test-dgubasen.api.union.golfbox.io/login.aspx  

https://dgubasen.api.union.golfbox.io/login.aspx

This will show the Swagger documentation for the available APIs for your account

## Test data

To test player information API's the following testusers can be used (PW is needed to login as player and get token)

| UnionID   | PW      | Name             | Token                                                  |
|-----------|---------|------------------|---------------------------------------------------------|
| 1016-3    | gb1234  | Test Testesen    | nkwHZozarin3vzSqwOJsSa2FXQcJniUtE_RUF42t3bI            |
| 1016-100  | msl1234 | Jonas            |                                                         |
| 1016-101  | 1234    | Morten           |                                                         |
| 1016-102  | 1234    | Ingenium Test    |                                                         |
| 1016-105  | gb1234  | Test Medlemstype |                                                         |
| 1016-15   | SG1234  | Tanja Lewis      |                                                         |
| 1016-41   | gb1234  | Test Testesen    |                                                         |


## Support
--------
If you have questions or need help, contact Dansk Golf Union:  
Email: [it@dgu.org](mailto:it@dgu.org)
