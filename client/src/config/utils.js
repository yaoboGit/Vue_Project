/**
 * @summary 设置cookie
 * @param {string} name cookie名称
 * @param {string} value cookie值
 * @param {int} expires 保存时间(单位:小时)
 * @param {string} path
 * @param {string} domain
 * @param {string} secure
 */
export const setCookie = (name, value, expires, path, domain, secure) => {
  let str = name + '=' + encodeURIComponent(value);
  if (expires > 0) {
    let date = new Date();
    date.setTime(date.getTime() + expires * 3600 * 1000);
    str += ';expires=' + date.toGMTString();
  }
  if (path) { str += ';path=' + path; }
  if (domain) { str += ';domain=' + domain; }
  if (secure) { str += ';secure=' + secure; }
  document.cookie = str;
};
/**
 * @summary 读取cookie
 * @param {string} name cookie名称
 * @retrun {string} value cookie值
 * @example
 */
export const getCookie = (name) => {
  let start = document.cookie.indexOf(name + '=');
  if ((!start) && (name !== document.cookie.substring(0, name.length))) { return ''; }
  if (start === -1) { return ''; }
  let len = start + name.length + 1;
  let end = document.cookie.indexOf(';', len);
  if (end === -1) { end = document.cookie.length; }
  return decodeURIComponent(document.cookie.substring(len, end));
};
