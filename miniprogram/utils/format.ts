export function padString(n: number) {
    return n < 10 ? '0' + n.toFixed(0) : n.toFixed(0)
}

//格式化时间
export function formatDuration(sec: number) { 
    const padString = (n: number) =>
      n < 10 ? '0' + n.toFixed(0) : n.toFixed(0)
    const h = Math.floor(sec/3600)
    sec -= 3600*h;
    const m = Math.floor(sec / 60)
    sec -= 60 *m
    const s = Math.floor(sec)
    return `${padString(h)}:${padString(m)}:${padString(s)}`
}
  
//算钱
export function formatFee(cents: number) {
    return (cents/100).toFixed(2)
}