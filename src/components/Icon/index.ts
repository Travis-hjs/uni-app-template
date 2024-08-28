
export function useSameProps() {
  return {
    /** 矩阵宽高 */
    size: {
      type: String,
      default: undefined
    },
    /** 线条的宽度 */
    lineWidth: {
      type: String,
      default: undefined
    },
    /** 线条颜色 */
    color: {
      type: String,
      default: undefined
    },
  }
}
