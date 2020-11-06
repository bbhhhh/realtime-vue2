<template>
    <div class="realtime">
        <h1 class="h1">{{ msg }}</h1>
        <div class="container" id="container-id">
            <div class="css-search-div" id="search-id">
                设备ID<input type="text" placeholder="deviceId" class="search" v-model="deviceId">
                起止时间
                <el-date-picker
                        v-model="search_time"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>

                <input type="button" class="add" @click="es_search" value="查询ES消息">
            </div>
            <!--            <p></p>-->
            <div class="css-filter-div">
                结果过滤<input type="text" placeholder="filter" @input="search" list="cars" class="search">
                <datalist id="cars">
                    <option v-for="item in searchlist" :value="item" :key="item.id"></option>
                </datalist>
                <!--<input type="button" class="add" @click="add" value="add">-->
            </div>
            <div>
                <table>
                    <tr>
                        <th>id</th>
                        <th>deviceId</th>
                        <th>readable time</th>
                        <th>epoch time</th>
                        <th>taskId</th>
                        <th>taskSource</th>
                        <th>eventCode</th>
                        <th>action</th>
                    </tr>
                    <tr v-cloak v-for="(item, index) of slist" :key="item.id">
                        <td>{{index+1}}</td>
                        <td>{{item._source.json_realtime.deviceInfo.deviceId}}</td>
                        <td>{{item._source['@timestamp']}}</td>
                        <td>{{item._source.json_realtime.actualTime}}</td>
                        <td>{{item._source.json_realtime.taskId}}</td>
                        <td>{{item._source.json_realtime.taskSource}}</td>
                        <td>{{item._source.json_realtime.eventType.eventCode}}</td>
                        <!--                <td>{{item.username}}</td>-->
                        <!--                <td>{{item.email}}</td>-->
                        <!--                <td>{{item.sex}}</td>-->
                        <!--                <td>{{item.province}}</td>-->
                        <td><a href="javascript:;" @click="showOverlay(index)">详情</a></td>
                    </tr>
                </table>
            </div>
            <DetailView :show_item='selectedlist' :isactive="isActive" v-cloak @change="changeOverlay"/>
        </div>
    </div>
</template>

<script>

    import axios from 'axios';
    import DetailView from "./DetailView";


    // 设置默认选中时间当天0:00:00~23:59：59
    const startDate = new Date();
    const endDate = new Date();
    startDate.setTime(endDate.getTime() - 24 * 3600 * 1000);

    export default {
        name: "RealTime",
        components: {
            DetailView
        },
        data() {
            return {
                msg: "Realtime Message Search",
                deviceId: "",
                isActive: false,
                selected: -1,
                selectedlist: {_source: {json_realtime: {}}},
                slist: [],
                searchlist: [],
                list: [],

                search_time: [startDate, endDate],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近15分钟',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 15 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近半小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 30 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近1小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 60 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近半天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 12 * 60 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近1天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近1周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 7 * 24 * 60 * 60 * 1000);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        }
        ,
        created() {

            this.search_time.push(startDate.valueOf());
            this.search_time.push(endDate.valueOf());
        },
        // async initData() {
        //
        // },
        methods:
            {
// 修改数据
            showOverlay: function (index) {
                this.selected = index;
                this.selectedlist = this.list[index];
//console.log(this.selectedlist);
                this.changeOverlay();
            }
            ,
            changeOverlay: function () {
                this.isActive = !this.isActive;
            }
            ,
// 获取需要渲染到页面中的数据
            setSlist: function (arr) {
                this.slist = JSON.parse(JSON.stringify(arr));
            }
            ,
// 搜索
            search: function (e) {
                var v = e.target.value,
                    self = this;
                self.searchlist = [];
                if (v) {
                    var ss = [];
                    // 过滤需要的数据
                    this.list.forEach(function (item) {
                        if (item._source.json_realtime.deviceInfo.deviceId.indexOf(v) > -1) {
                            if (self.searchlist.indexOf(item._source.json_realtime.deviceInfo.deviceId) == -1) {
                                self.searchlist.push(item._source.json_realtime.deviceInfo.deviceId);
                            }
                            ss.push(item);
                        } else if (item._source.json_realtime.taskId.indexOf(v) > -1) {
                            if (self.searchlist.indexOf(item._source.json_realtime.taskId) == -1) {
                                self.searchlist.push(item._source.json_realtime.taskId);
                            }
                            ss.push(item);
                        }
                    });
                    this.setSlist(ss); // 将过滤后的数据给了slist
                } else {
                    // 没有搜索内容，则展示全部数据
                    this.setSlist(this.list);
                }
            }
            ,

            es_search: function () {
// fetch realtime message via axios api
// ES Server must support CORS access, otherwise following request will be failed.


                var dataObj = {
                    //size: 10,
                    query: {bool: {filter: []}},
                    sort: [{"json_realtime.actualTime": "desc"}]
                };
                //set filter for searching range
                // console.log("startTime=" + this.search_time[0].getTime());
                // console.log("endTime=" + this.search_time[1].getTime());
                var rangeFilter = {range: {}};
                rangeFilter.range['json_realtime.actualTime'] = {
                    gte: this.search_time[0].getTime(),
                    lte: this.search_time[1].getTime()
                };
                dataObj.query.bool.filter.push(rangeFilter);


                //set filter for deviceid
                if (this.deviceId != null && this.deviceId != "") {
                    var devIdFilter = {wildcard: {}};  // 模糊查询
                    devIdFilter.wildcard['json_realtime.deviceInfo.deviceId'] = '*' + this.deviceId + '*';
                    dataObj.query.bool.filter.push(devIdFilter);

                }

                var confObj = {
                    method: 'post',
                    //url: 'http://135.251.218.101:9200/ds-realtime*/_search',
                    //url: 'http://135.251.218.88:9008/ds-realtime*/_search',
                    // url: 'https://c6f83933d54a45d8bde48825bfcc6c26.ap-southeast-1.aws.found.io:9243/ds-realtime*/_search',
                    url: 'http://150.158.172.180:8080/ds-realtime*/_search',
                    //headers: {'contentType': 'application/json'},
                    headers: {'Authorization': 'Basic ZWxhc3RpYzp3blJoWjNFbEdzbVBHTzJnblg0RGNIVnk='},
                    data: dataObj
                };
                console.log(JSON.stringify(confObj.data));
                axios(confObj).then(response => {
                    this.list = response.data.hits.hits;
                    this.setSlist(this.list);
                }).catch(function (error) {
                    console.log(error);
                });
// console.log(app.slist);

            }
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    [v-cloak] {
        display: none
    }

    table {
        border: 1px solid #ccc;
        padding: 0;
        border-collapse: collapse;
        table-layout: fixed;
        margin-top: 10px;
        width: 100%;
    }

    table td,
    table th {
        height: 30px;
        border: 1px solid #ccc;
        background: #fff;
        font-size: 15px;
        padding: 3px 3px 3px 8px;
    }

    table th:first-child {
        width: 30px;
    }

    .container,
    .st {
        width: 1400px;
        margin: 10px auto 0;
        font-size: 13px;
        font-family: 'Microsoft YaHei'
    }

    .container .css-search-div {
        float: left;
        display: inline;
    }

    .container .search {
        font-size: 15px;
        padding: 4px;
    }

    .container .add {
        padding: 5px 15px;
    }

    .container .css-filter-div {
        float: right;
        display: inline;
    }

</style>