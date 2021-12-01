
export const retrieveCookie = (name:string) => {
    return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
    });
  }
  
export const deleteCookie = (name: string, path: string, domain: string) => {
    if (retrieveCookie(name)) {
      document.cookie = name + "=" +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }