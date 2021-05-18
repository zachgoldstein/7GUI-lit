import{Z as e,w as t}from"./property-87bb8bd7.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=2;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{et:n}=e,r=()=>document.createComment(""),o=(e,t,s)=>{var o;const l=e.A.parentNode,i=void 0===t?e.B:t.A;if(void 0===s){const t=l.insertBefore(r(),i),o=l.insertBefore(r(),i);s=new n(t,o,e,e.options)}else{const t=s.B.nextSibling,n=s.M!==e;if(n&&(null===(o=s.Q)||void 0===o||o.call(s,e),s.M=e),t!==i||n){let e=s.A;for(;e!==t;){const t=e.nextSibling;l.insertBefore(e,i),e=t}}}return s},l=(e,t,s=e)=>(e.I(t,s),e),i={},c=(e,t=i)=>e.H=t,u=e=>{var t;null===(t=e.P)||void 0===t||t.call(e,!1,!0);let s=e.A;const n=e.B.nextSibling;for(;s!==n;){const e=s.nextSibling;s.remove(),s=e}},f=(e,t,s)=>{const n=new Map;for(let r=t;r<=s;r++)n.set(e[r],r);return n},a=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends class{constructor(e){}T(e,t,s){this.Σdt=e,this.M=t,this.Σct=s}S(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}{constructor(e){if(super(e),e.type!==s)throw Error("repeat() can only be used in text expressions")}Mt(e,t,s){let n;void 0===s?s=t:void 0!==t&&(n=t);const r=[],o=[];let l=0;for(const t of e)r[l]=n?n(t,l):l,o[l]=s(t,l),l++;return{values:o,keys:r}}render(e,t,s){return this.Mt(e,t,s).values}update(e,[s,n,r]){var i;const a=e.H,{values:d,keys:v}=this.Mt(s,n,r);if(!a)return this.Pt=v,d;const h=null!==(i=this.Pt)&&void 0!==i?i:this.Pt=[],p=[];let b,x,g=0,M=a.length-1,m=0,B=d.length-1;for(;g<=M&&m<=B;)if(null===a[g])g++;else if(null===a[M])M--;else if(h[g]===v[m])p[m]=l(a[g],d[m]),g++,m++;else if(h[M]===v[B])p[B]=l(a[M],d[B]),M--,B--;else if(h[g]===v[B])p[B]=l(a[g],d[B]),o(e,p[B+1],a[g]),g++,B--;else if(h[M]===v[m])p[m]=l(a[M],d[m]),o(e,a[g],a[M]),M--,m++;else if(void 0===b&&(b=f(v,m,B),x=f(h,g,M)),b.has(h[g]))if(b.has(h[M])){const t=x.get(v[m]),s=void 0!==t?a[t]:null;if(null===s){const t=o(e,a[g]);l(t,d[m]),p[m]=t}else p[m]=l(s,d[m]),o(e,a[g],s),a[t]=null;m++}else u(a[M]),M--;else u(a[g]),g++;for(;m<=B;){const t=o(e,p[B+1]);l(t,d[m]),p[m++]=t}for(;g<=M;){const e=a[g++];null!==e&&u(e)}return this.Pt=v,c(e,p),t}});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */export{a as c};
