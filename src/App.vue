<script>
import Global from "./modules/Global";

export default {
    onLaunch() {
        console.log("App Launch")
        Global.initAppOption();
        Global.initUserInfo();
    },
    onShow() {
        console.log("App Show")
    },
    onHide() {
        console.log("App Hide")
    }
}
</script>

<style>
/*每个页面公共css */
@import "./styles/base.css";

</style>
