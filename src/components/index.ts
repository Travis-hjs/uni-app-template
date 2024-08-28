import { onUnmounted, reactive, watch } from "vue";

export { default as TheButton } from "./TheButton.vue";
export { default as TheFooter } from "./TheFooter.vue";

/**
 * 遮罩层过渡功能
 * - 由于非`H5`环境下无法实现`el.addEventListener("transitionend", fn)`功能，所以只能使用`setTimeout`的方式去实现
 * @param watchShow 
 * @param millisecond 动画过渡时间
 */
export function useTransitionLayer(watchShow: () => boolean, millisecond = 300) {

  const layer = reactive({
    /** 是否隐藏或者销毁节点 */
    visible: false,
    /** 是否添加过渡`class` */
    transition: false
  });

  let timer: ReturnType<typeof setTimeout>;

  function toShow() {
    layer.visible = true;
    timer = setTimeout(function() {
      layer.transition = true;
    });
  }

  function toHide() {
    layer.transition = false;
    timer = setTimeout(function() {
      layer.visible = false;
    }, millisecond);
  }

  watch(watchShow, function(val) {
    timer && clearTimeout(timer);
    val ? toShow() : toHide();
  }, {
    immediate: true
  });

  onUnmounted(function() {
    clearTimeout(timer);
  });

  return {
    layer
  }
}
