function y(){}function F(t,e){for(const n in e)t[n]=e[n];return t}function P(t){return t()}function D(){return Object.create(null)}function b(t){t.forEach(P)}function A(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function R(t){return Object.keys(t).length===0}function U(t,...e){if(t==null)return y;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ft(t,e,n){t.$$.on_destroy.push(U(e,n))}function _t(t,e,n,i){if(t){const r=M(t,e,n,i);return t[0](r)}}function M(t,e,n,i){return t[1]&&i?F(n.ctx.slice(),t[1](i(e))):n.ctx}function dt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],s=Math.max(e.dirty.length,r.length);for(let u=0;u<s;u+=1)o[u]=e.dirty[u]|r[u];return o}return e.dirty|r}return e.dirty}function ht(t,e,n,i,r,o){if(r){const s=M(e,n,i,o);t.p(s,r)}}function mt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function pt(t){const e={};for(const n in t)e[n]=!0;return e}function yt(t){return t&&A(t.destroy)?t.destroy:y}let E=!1;function W(){E=!0}function G(){E=!1}function I(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function J(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const l=e[c].claim_order,f=(r>0&&e[n[r]].claim_order<=l?r+1:I(1,r,$=>e[n[$]].claim_order,l))-1;i[c]=n[f]+1;const a=f+1;n[a]=c,r=Math.max(a,r)}const o=[],s=[];let u=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);u>=c;u--)s.push(e[u]);u--}for(;u>=0;u--)s.push(e[u]);o.reverse(),s.sort((c,l)=>c.claim_order-l.claim_order);for(let c=0,l=0;c<s.length;c++){for(;l<o.length&&s[c].claim_order>=o[l].claim_order;)l++;const f=l<o.length?o[l]:null;t.insertBefore(s[c],f)}}function K(t,e){if(E){for(J(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function gt(t,e,n){E&&!n?K(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function Q(t){t.parentNode&&t.parentNode.removeChild(t)}function bt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function V(t){return document.createElement(t)}function X(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function S(t){return document.createTextNode(t)}function xt(){return S(" ")}function $t(){return S("")}function vt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Et(t){return function(e){return e.preventDefault(),t.call(this,e)}}function wt(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function Y(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const Z=["width","height"];function kt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&Z.indexOf(i)===-1?t[i]=e[i]:Y(t,i,e[i])}function tt(t){return Array.from(t.childNodes)}function et(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function L(t,e,n,i,r=!1){et(t);const o=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const u=t[s];if(e(u)){const c=n(u);return c===void 0?t.splice(s,1):t[s]=c,r||(t.claim_info.last_index=s),u}}for(let s=t.claim_info.last_index-1;s>=0;s--){const u=t[s];if(e(u)){const c=n(u);return c===void 0?t.splice(s,1):t[s]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,u}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function B(t,e,n,i){return L(t,r=>r.nodeName===e,r=>{const o=[];for(let s=0;s<r.attributes.length;s++){const u=r.attributes[s];n[u.name]||o.push(u.name)}o.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Nt(t,e,n){return B(t,e,n,V)}function At(t,e,n){return B(t,e,n,X)}function nt(t,e){return L(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>S(e),!0)}function St(t){return nt(t," ")}function jt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Ct(t,e){t.value=e??""}function Dt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Ot(t,e,n){t.classList[n?"add":"remove"](e)}function it(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function Tt(t,e){const n=[];let i=0;for(const r of e.childNodes)if(r.nodeType===8){const o=r.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(r)):o===`HEAD_${t}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function Pt(t,e){return new t(e)}let g;function p(t){g=t}function x(){if(!g)throw new Error("Function called outside component initialization");return g}function Mt(t){x().$$.before_update.push(t)}function Lt(t){x().$$.on_mount.push(t)}function Bt(t){x().$$.after_update.push(t)}function Ht(t){x().$$.on_destroy.push(t)}function qt(){const t=x();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=it(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,o)}),!o.defaultPrevented}return!0}}function zt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const h=[],O=[];let m=[];const T=[],H=Promise.resolve();let k=!1;function q(){k||(k=!0,H.then(z))}function Ft(){return q(),H}function N(t){m.push(t)}const w=new Set;let d=0;function z(){if(d!==0)return;const t=g;do{try{for(;d<h.length;){const e=h[d];d++,p(e),rt(e.$$)}}catch(e){throw h.length=0,d=0,e}for(p(null),h.length=0,d=0;O.length;)O.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];w.has(n)||(w.add(n),n())}m.length=0}while(h.length);for(;T.length;)T.pop()();k=!1,w.clear(),p(t)}function rt(t){if(t.fragment!==null){t.update(),b(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}function st(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const v=new Set;let _;function Rt(){_={r:0,c:[],p:_}}function Ut(){_.r||b(_.c),_=_.p}function ct(t,e){t&&t.i&&(v.delete(t),t.i(e))}function Wt(t,e,n,i){if(t&&t.o){if(v.has(t))return;v.add(t),_.c.push(()=>{v.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function Gt(t,e){const n={},i={},r={$$scope:1};let o=t.length;for(;o--;){const s=t[o],u=e[o];if(u){for(const c in s)c in u||(i[c]=1);for(const c in u)r[c]||(n[c]=u[c],r[c]=1);t[o]=u}else for(const c in s)r[c]=1}for(const s in i)s in n||(n[s]=void 0);return n}function It(t){t&&t.c()}function Jt(t,e){t&&t.l(e)}function ot(t,e,n,i){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),i||N(()=>{const s=t.$$.on_mount.map(P).filter(A);t.$$.on_destroy?t.$$.on_destroy.push(...s):b(s),t.$$.on_mount=[]}),o.forEach(N)}function ut(t,e){const n=t.$$;n.fragment!==null&&(st(n.after_update),b(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function lt(t,e){t.$$.dirty[0]===-1&&(h.push(t),q(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Kt(t,e,n,i,r,o,s,u=[-1]){const c=g;p(t);const l=t.$$={fragment:null,ctx:[],props:o,update:y,not_equal:r,bound:D(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:D(),dirty:u,skip_bound:!1,root:e.target||c.$$.root};s&&s(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(a,$,...j)=>{const C=j.length?j[0]:$;return l.ctx&&r(l.ctx[a],l.ctx[a]=C)&&(!l.skip_bound&&l.bound[a]&&l.bound[a](C),f&&lt(t,a)),$}):[],l.update(),f=!0,b(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){W();const a=tt(e.target);l.fragment&&l.fragment.l(a),a.forEach(Q)}else l.fragment&&l.fragment.c();e.intro&&ct(t.$$.fragment),ot(t,e.target,e.anchor,e.customElement),G(),z()}p(c)}class Qt{$destroy(){ut(this,1),this.$destroy=y}$on(e,n){if(!A(n))return y;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!R(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{bt as $,ot as A,ut as B,_t as C,ht as D,mt as E,dt as F,K as G,y as H,ft as I,Ht as J,X as K,At as L,F as M,kt as N,Ot as O,Ct as P,vt as Q,Et as R,Qt as S,yt as T,Gt as U,b as V,pt as W,qt as X,Mt as Y,wt as Z,zt as _,xt as a,A as a0,Tt as a1,gt as b,St as c,Wt as d,$t as e,Ut as f,ct as g,Q as h,Kt as i,Bt as j,V as k,Nt as l,tt as m,Y as n,Lt as o,Dt as p,S as q,nt as r,at as s,Ft as t,jt as u,Rt as v,O as w,Pt as x,It as y,Jt as z};