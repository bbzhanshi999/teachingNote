<template>
    <div>
        <img src="../assets/logo.png"/>
        <h1>电子商务平台</h1>
        <div class="input-box">
            <label>用户名</label>
            <input type="text" v-model="user.username"/>
            <!--v-model 实现的是双向绑定，也就是value的值改变会带动user.username的改变，反之一样-->
        </div>
        <div class="input-box">
            <label>密码</label>
            <input type="password" v-model="user.password"/>
        </div>
        <div class="input-box">
            <button v-on:click="login">提交</button>
            <button v-on:click="clear">清空</button>
        </div>
    </div>
</template>

<script>
    //ctrl+alt+l快速格式化代码
    export default {
        name: "Login",
        //data 代表的是当前页面的数据层
        data: function () {
            return {
                user: {
                    username:'',
                    password:''
                }
            }
        },
        methods:{
            clear:function () {
                /* ctrl+ / 快速注释，ctrl+shift+/ 快速块状注释*/
            //    清空输入框中的内容，data中的任意属性都可以通过this对象获取，this代表的是当前的页面实例对象
                this.user.username = "";
                this.user.password = "";
            },
            login:function(){
                //通过获取axios对象，调用其post方法发送http请求
                //post第一个参数是地址，第二个参数要提交的数据
                this.axios.post('/api/main/login',this.user).then((resp)=>{
                    //将后台获取到的userInfo保存至前台的浏览器缓存中 ，resp代表response，resp.data代表获取到的用户信息
                    //通过获取vuex的store对象，调用其commit方法存储从后台获取到的user对象
                    this.$store.commit("setUser",resp.data);

                    //进入详情页，实际上是让router的路径指向/index
                    this.$router.push({path:"/index"});
                });
            }
        }
    }
</script>

<style scoped>
    label {
        width: 80px;
        display: inline-block;
    }

    .input-box {
        margin-bottom: 20px;
    }

    button {
        margin-right: 10px;
    }
</style>