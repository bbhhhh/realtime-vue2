<template>
    <div class="overlay" v-show="isactive">
        <div class="con">
            <h2 class="title">详情</h2>
            <div class="content">
                <div class="scroll-con">
                    <pre>{{show_item._source.json_realtime}}</pre>
                </div>
                <p>
                    <input type="button" @click="$emit('change')" value="取消">
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailView",
        props: {
            show_item: Object,
            isactive: Boolean
        },
        // computed: {
        //     detail_item() {
        //         return this.show_item['_source']['json_realtime'];
        //     }
        // }
    }
</script>

<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 6;
        background: rgba(0, 0, 0, 0.7);
    }

    .overlay td:first-child {
        width: 66px;
    }

    .overlay .con {
        position: absolute;
        width: 420px;
        min-height: 300px;
        background: #fff;
        left: 50%;
        top: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        /*margin-top: -150px;*/
        padding: 20px;
    }

    .overlay .scroll-con {

        /*< div style = "height:100%;width:100%;overflow:auto;background:#EEEEEE;" >*/
        width: 400px;
        height: 400px;
        overflow: auto;
        background: #EEEEEE;
    }
</style>