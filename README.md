# realtime-vue2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Resolve CORS problems
当ES Server与Web Server不在一起时，axios向ES Server发起POST请求进行数据查询时，会引发CORS跨域问题，解决方法如下：
RealTime.vue代码中Axios的POST URL改成Web Server地址,如下所示： 
```javascript
                var confObj = {
                    method: 'post',
                    //url: 'http://135.251.218.101:9200/ds-realtime*/_search',
                    url: 'http://135.251.218.88:9008/ds-realtime*/_search',
                    data: dataObj
                };
```
修改Web Server /etc/nginx/nginx.conf，利用Nginx进行地址转换:
```nginx
        location /ds-realtime*/ {
          proxy_pass http://135.251.218.101:9200;
        }
```
当Web Server收到```/ds-realtime*/``` URL时，将转发到实际的ES Server上，解决CORS问题。

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
