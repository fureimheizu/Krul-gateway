# Krul-gateway

To register a service to the gateway it needs a POST request to the register endpoint.

Example of a POST request:

```ts
axios({
  method: "post",
  url: `${gatewayUrl}/register`,
  data: {
    name,
    url
  }
});
```
