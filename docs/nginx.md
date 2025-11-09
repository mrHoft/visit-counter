## Nginx server config
```
server {
  server_name counter.domain.com;
  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://localhost:3082/;
  }
}
```
