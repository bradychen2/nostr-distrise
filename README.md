## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Requirements

### Phase I: Building a Simple nostr Client

- Write a nostr client that connects to a given nostr relay via websocket. The following types of messages must be supported:

  - `["EVENT", <event JSON as defined above>]`, used to publish events. You are only required to support event type 1 (a note) for DISTRISE.
  - `["REQ", <subscription_id>, <filters JSON>...]`, used to request events and subscribe to new updates.
  - `["CLOSE", <subscription_id>]`, used to stop previous subscriptions.

- Please provide short written answer to the following questions in your project’s README:
  - What are some of the challenges you faced while working on Phase 1?
  - What kind of failures do you expect to a project such as DISTRISE to encounter?

### Phase II: Building Your Own Relay

As implementation details for relays are less detailed in NIP-01, here is the specific scope of features that you need to provide.

- Accept events from nostr clients (**NIP-42 authentication is not required**)
- Provide a websockets (ws:// or wss://) service
- Support the following types of messages that your client is able to send:
  - `["EVENT", <event JSON as defined above>]`, used to publish events.
  - `["REQ", <subscription_id>, <filters JSON>...]`, used to request events and subscribe to new updates.
    - **You are not required to support filters in Phase 2, and you can broadcast events to all clients regardless of their filters (i.e. ignore the filters they send)**
    - **You only need to support 1 subscription per client (NIPS-01 requires relays to support multiple subscriptions, but we only need 1 for this project)**
  - `["CLOSE", <subscription_id>]`, used to stop previous subscriptions.
- Verify that the event’s `id` and signature (`sig`) are valid
- Verify that you have completed the Test Cases listed in Appendix A for Phase 2
- Please provide a short summary of the challenges you faced while working on Phase 2, ideally not more than 500 words. You will submit the summary in your project’s README as well.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
