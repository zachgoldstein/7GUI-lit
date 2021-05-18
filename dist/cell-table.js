import{r as t,e,n as l,h as s,T as i}from"./property-87bb8bd7.js";import{r as n}from"./state-13a58fab.js";const r={add:t=>t[0]+t[1],sub:t=>t[0]-t[1],div:t=>t[0]/t[1],mul:t=>t[0]*t[1],mod:t=>t[0]%t[1],sum:t=>t.reduce(((t,e)=>t+e),0),prod:t=>t.reduce(((t,e)=>t*e),1)};function o(t){return`${t.column}-${t.row}`}class a extends EventTarget{constructor(){super(),this.cellData=new Map,this.cellDependencies=new Map}updateCell(t){const e=o(t),l=this.cellData.get(e);if(l){if(l.row!=t.row||l.column!=t.column)return void console.error(`Key ${e} returned unexpected data for row:${l.row} and column: ${l.column}}`);this._isFormula(l.input)&&this._unmarkDependency(e,this._getCellsForOp(l.input))}if(this._isFormula(t.input)&&this._markDependency(e,this._getCellsForOp(t.input)),this._isFormula(t.input)){const l=this._getOp(t.input);if(l){const s=this._getCellsForOp(t.input).map((t=>{const e=this.cellData.get(t);return e?parseFloat(e.value):0}));t.value=l(s).toString(),console.log(`op value:${t.value} for cell ${e}`)}}else t.value=t.input;this.cellData.set(e,t),console.log(`Set cell ${e} to ${t.value}`);this._getDependentCells(e).forEach((t=>{const l=this.cellData.get(t);this._getDependentCells(t).includes(e)?console.error(`Found circular dep calculating ${e} dependency ${t}`):l&&this.updateCell(l)})),this._dispatchCellUpdate(t)}_markDependency(t,e){e.forEach((l=>{let s=this.cellDependencies.get(l);s||(s=[]),s.push({originCell:t,dependentCells:e}),this.cellDependencies.set(l,s)}))}_unmarkDependency(t,e){e.forEach((e=>{let l=this.cellDependencies.get(e);l&&(l=l.filter((e=>e.originCell!=t)),this.cellDependencies.set(e,l))}))}_getDependentCells(t){const e=this.cellDependencies.get(t);if(!e)return[];const l=[];return e.forEach((t=>{l.push(t.originCell)})),l}_isFormula(t){return!(!t.includes("(")||!t.includes(")"))}_getOp(t){console.log(t);for(const[e,l]of Object.entries(r))if(t.includes(e))return l}_getCellsForOp(t){if(!t.includes(":")&&!t.includes(","))return[o({value:t,input:t,row:(t[0].toUpperCase().charCodeAt(0)-65).toString(),column:t[1]})];const e=t.match(/\((.*?)\)/);if(!e||2!=e.length)return[];const l=e[1];if(l.includes(":")){const[e,s]=l.split(":");if(!e)return[];const i=e[0].toUpperCase().charCodeAt(0)-65,n=e[1];if(!s)return[o({value:t,input:t,row:n,column:i.toString()})];const r=s[0].toUpperCase().charCodeAt(0)-65,a=s[1],c=[];return Array.from({length:r-i+1},((e,l)=>{Array.from({length:parseInt(a)-parseInt(n)+1},((e,s)=>{c.push(o({value:t,input:t,row:(parseInt(n)+s).toString(),column:(i+l).toString()}))}))})),c}if(l.includes(",")){const[e,s]=l.split(",");return[o({value:t,input:t,row:e[1],column:(e[0].toUpperCase().charCodeAt(0)-65).toString()}),o({value:t,input:t,row:s[1],column:(s[0].toUpperCase().charCodeAt(0)-65).toString()})]}return[]}_dispatchCellUpdate(t){return this.dispatchEvent(new CustomEvent("update",{detail:t,cancelable:!0}))}}const c=new a;class u{constructor(t,e,l){(this.host=t).addController(this),this.store=c,this.cellData={row:e,column:l,input:"",value:""}}_storeUpdate(t){if(!t||!t.target)return;const e=t.detail;e.row==this.cellData.row&&e.column==this.cellData.column&&(this.cellData.value=e.value,this.host.requestUpdate())}setCell(t){this.cellData.input=t,this.store.updateCell(this.cellData)}hostConnected(){this.store.addEventListener("update",this._storeUpdate.bind(this))}hostDisconnected(){this.store.removeEventListener("update",this._storeUpdate.bind(this))}}var d=function(t,e,l,s){var i,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,l):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,l,s);else for(var o=t.length-1;o>=0;o--)(i=t[o])&&(r=(n<3?i(r):n>3?i(e,l,r):i(e,l))||r);return n>3&&r&&Object.defineProperty(e,l,r),r};let h=class extends s{constructor(t,e){super(),this._isEditing=!1,this._editValue="",this._initialEditValue="",this.cellController=new u(this,t,e),this.keyDownBound=this._keyDown.bind(this)}_setCellInput(t){t&&t.target&&(this._editValue=t.target.value)}_startEditing(t){console.log(t),this._isEditing=!0,this._initialEditValue=this._editValue,this.addEventListener("keydown",this.keyDownBound)}_stopEditing(t){console.log(t),this.removeEventListener("keydown",this.keyDownBound),this._isEditing=!1,this._editValue=this._initialEditValue,this.requestUpdate()}_keyDown(t){"Enter"==t.key&&(t.preventDefault(),this.removeEventListener("keydown",this.keyDownBound),this._isEditing=!1,this._commit(),this._editValue=this.cellController.cellData.value,this._initialEditValue=this._editValue,this.blur())}_commit(){this._isInputValid(this._editValue)?this.cellController.setCell(this._editValue):console.error(`Invalid input ${this._editValue} for row ${this.cellController.cellData.row} and column ${this.cellController.cellData.column}`)}get cellText(){return this._isEditing?this._editValue:this.cellController.cellData.value}_isInputValid(t){return console.log(t),!0}render(){return i`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"><div><input type="text" id="start-date" name="start-date" .value="${this.cellText}" @click="${this._startEditing}" @input="${this._setCellInput}" @blur="${this._stopEditing}"></div>`}};h.styles=t``,d([e()],h.prototype,"_editValue",void 0),h=d([l("seven-gui-cell")],h);var p=function(t,e,l,s){var i,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,l):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,l,s);else for(var o=t.length-1;o>=0;o--)(i=t[o])&&(r=(n<3?i(r):n>3?i(e,l,r):i(e,l))||r);return n>3&&r&&Object.defineProperty(e,l,r),r};let m=class extends s{constructor(){super(),this.columns=5,this.rows=5,this.cells=[],this.rows=5,this.columns=5,Array.from({length:this.rows},((t,e)=>{this.cells.push();const l=[];Array.from({length:this.columns},((t,s)=>{l.push(new h(e.toString(),s.toString()))})),this.cells.push(l)}))}render(){return i`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css"><div class="box"><div class="table-container"><table class="table"><thead><tr><th></th>${Array.from({length:this.columns},((t,e)=>i`<th>Col: ${String.fromCharCode(65+e)}</th>`))}</tr></thead><tbody>${this.cells.map(((t,e)=>i`<tr><td>${e}</td>${t.map((t=>i`<td>${t}</td>`))}</tr>`))}</tbody></table></div><Span>Click inside a cell to edit its content. Hit enter to apply.{' '} Click outside the cell or hit escape to abort. Here are some example contents: '5.5', 'Some text', '=A1', '=sum(B2:C4)', '=div(C1, 5)'.</Span></div>`}};m.styles=t``,p([n()],m.prototype,"columns",void 0),p([n()],m.prototype,"rows",void 0),m=p([l("seven-gui-cell-table")],m);export{m as CellTable};