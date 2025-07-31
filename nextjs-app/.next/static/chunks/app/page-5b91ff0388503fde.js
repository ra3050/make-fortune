(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{8506:(e,t,r)=>{Promise.resolve().then(r.bind(r,9708))},9708:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>D});var l=r(5155),n=r(2115),o=r(4987),a=r(8102);let i=async function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"1d",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:500,l=`https://api.binance.com/api/v3/klines?symbol=${e}&interval=${t}&limit=${r}`;try{let e=await fetch(l),t=await e.json();return a.NextResponse.json(t)}catch(e){console.log("error: 알수없는 오류: ",e)}},s=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:13,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;if(arguments.length>3&&arguments[3],t<=1)return e[-2][4];let l=2/(1+t),n=e.length??0,o={length:t,ma:[]},a=[],i=0;for(let t=0;t<n;t++)0!==t?1===r?(i=e[t].close*l+i*(1-l),a.push({timeFrame:e[t].timeFrame,value:i})):(i=parseFloat(e[t][4])*l+i*(1-l),a.push({timeFrame:parseFloat(e[t][0]),value:i})):1===r?(i=e[t].close,a.push({timeFrame:e[t].timeFrame,value:i})):(i=parseFloat(e[t][4]),a.push({timeFrame:parseFloat(e[t][0]),value:i}));return o.ma=a,o},c=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[];for(let l=1;l<e.length;l++)1===t?r.push(e[l].close-e[l-1].close):r.push(parseFloat(e[l][4])-parseFloat(e[l-1][4]));return r},h=(e,t)=>{let r=1/t,l=[],n=0;for(let o=0;o<e.length;o++)if(o<t-1)l.push({timeFrame:e[o].timeFrame,value:0});else if(o===t){let r=e.slice(0,t).reduce((e,t)=>e+t.value,0)/t;n=r,l.push({timeFrame:e[o].timeFrame,value:r})}else n=r*e[o].value+(1-r)*n,l.push({timeFrame:e[o].timeFrame,value:n});return l},u=function(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,l=c(e,r),n=l.map((t,l)=>({timeFrame:1===r?e[l+1].timeFrame:e[l][0],value:Math.max(t,0)})),o=l.map((t,l)=>({timeFrame:1===r?e[l+1].timeFrame:e[l][0],value:Math.abs(Math.min(t,0))})),a=h(n,t),i=h(o,t),s=a.map((e,t)=>{let r=i[t];return 0===r.value?{timeFrame:e.timeFrame,value:100}:0===e.value?{timeFrame:e.timeFrame,value:0}:{timeFrame:e.timeFrame,value:100-100/(1+e.value/r.value)}}),u=e.length-s.length;if(0<u)for(let e=0;e<u;e++)s=[{timeFrame:0,value:0},...s];return s},f=e=>{let{rsi:t=[],scrollX:r=0,canvasWidth:o=0}=e||{},a=(0,n.useRef)(null),i=(0,n.useRef)(null),[s,c]=(0,n.useState)(null),h=(()=>{let[e,t]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{t(!0)},[]),e})();return(0,n.useEffect)(()=>{let e=a.current;if(!e)return;e.width=t?.length??0,e.height=100;let r=e.getContext("2d");r&&h&&(r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,e.width,e.height),r.strokeStyle="#8D50AE",r.lineWidth=1,i.current=r,c(r))},[t,h,o]),(0,n.useEffect)(()=>{if(!s||!t)return;let e=a.current;if(!e||!h)return;s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,e.width,e.height),s.translate(0,0),s.scale(1,-1),s.translate(0,-100),s.beginPath();let l=!0;for(let e=r;e<r+o&&!(e>=t.length);e++)l?(s.moveTo(e,t[e].value),l=!1):s.lineTo(e,t[e].value);s.stroke(),s.beginPath(),s.moveTo(r,70),s.lineTo(r+o,70),s.stroke(),s.beginPath(),s.moveTo(r,30),s.lineTo(r+o,30),s.stroke()},[r,t,h,o]),(0,l.jsx)("canvas",{ref:a,style:{borderTop:"1px solid #1F232E"}})},d=o.Ay.div`
  overflow-x: auto; // 가로 스크롤 활성화
  overflow-y: hidden; // 세로 스크롤 비활성화
  background: #131722;
  /* user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; */

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
  -ms-overflow-style: none; // IE, Edge
  scrollbar-width: none; //Firebox
`,p=e=>{let{heikin:t=[],ema:r=[],rsi:o=[]}=e||{},a=(0,n.useRef)(null),i=(0,n.useRef)(null),s=(0,n.useRef)(null),[c,h]=(0,n.useState)(null),[u,p]=(0,n.useState)(0),[m,g]=(0,n.useState)(0),[x,v]=(0,n.useState)(0),[T,w]=(0,n.useState)(!1),[b,S]=(0,n.useState)(0),[j,F]=(0,n.useState)(0);(0,n.useEffect)(()=>{g(window.innerHeight-100),v(window.innerWidth)},[]),(0,n.useEffect)(()=>{let e=i.current;if(!e)return;e.width=t.length??0,e.height=m;let r=e.getContext("2d");r&&(r.setTransform(1,0,0,1,0,0),r.clearRect(0,0,e.width,e.height),r.strokeStyle="white",r.lineWidth=2,s.current=r,h(r))},[m,x,t]),(0,n.useEffect)(()=>{if(!r||!t||!c)return;let e=i.current;if(!e)return;c.setTransform(1,0,0,1,0,0),c.clearRect(0,0,e.width,e.height);let l=t.slice(u,u+x);if(0===l.length)return;let n=Math.max(...l.map(e=>e.high)),o=Math.min(...l.map(e=>e.low)),a=(n-o)*.1,s=.9*m/(n-o+2*a);c.translate(0,m),c.scale(1,-s),c.translate(0,-(o-a)),c.beginPath(),r.forEach(e=>{c.beginPath();let t=!0;for(let r=u;r<u+x&&!(r>=e.ma.length);r++)t?(c.moveTo(r,e.ma[r].value),t=!1):c.lineTo(r,e.ma[r].value);c.stroke()});for(let e=u;e<u+x&&(c.beginPath(),!(e>=t.length));e++)0!==e&&t[e].open>t[e].close?c.strokeStyle="#F05350":c.strokeStyle="#26A69A",t[e].upperDivergence?t[e].shiftInTrend&&(c.strokeStyle="#FFD700"):t[e].lowwerDivergence&&t[e].shiftInTrend&&(c.strokeStyle="#FFD700"),c.moveTo(e,t[e].high),c.lineTo(e,t[e].low),c.stroke();c.strokeStyle="white"},[u,r,t,x,m]);let D=()=>{w(!1)};return(0,l.jsxs)(d,{ref:a,onMouseDown:e=>{a.current&&(w(!0),S(e.pageX-a.current.offsetLeft),F(a.current.scrollLeft))},onMouseMove:e=>{if(!T||!a.current)return;e.preventDefault();let t=e.pageX-a.current.offsetLeft;a.current.scrollLeft=j+(b-t),p(a.current.scrollLeft)},onMouseUp:D,onMouseLeave:D,onTouchStart:e=>{a.current&&(w(!0),S(e.touches[0].pageX-a.current.offsetLeft),F(a.current.scrollLeft))},onTouchMove:e=>{if(!T||!a.current)return;e.preventDefault();let t=e.touches[0].pageX-a.current.offsetLeft;a.current.scrollLeft=j+(b-t),p(a.current.scrollLeft)},onTouchEnd:()=>{w(!1)},onPointerDown:e=>{a.current&&(w(!0),S(e.pageX-a.current.offsetLeft),F(a.current.scrollLeft))},onPointerMove:e=>{if(!T||!a.current)return;e.preventDefault();let t=e.pageX-a.current.offsetLeft;a.current.scrollLeft=j+(b-t),p(a.current.scrollLeft)},onPointerUp:()=>{w(!1)},onWheel:e=>{if(e.preventDefault(),!a.current)return;let t=e.deltaX,r=a.current.scrollLeft;a.current.scrollLeft=r+t,p(a.current.scrollLeft),e.deltaY},children:[(0,l.jsx)("canvas",{ref:i}),(0,l.jsx)(f,{rsi:o,scrollX:u,canvasWidth:x})]})},m=o.Ay.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap; // 한 줄로 표시
  overflow-x: auto; // 가로 스크롤 활성화
  position: absolute;
  top: 10px;
  left: 10px;
  max-width: calc(100vw - 20px); // 화면 너비에서 여백 제외
  padding-right: 10px; // 오른쪽 여백 추가

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`,g=o.Ay.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  margin-right: 10px;
`,x=o.Ay.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`,v=o.Ay.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`,T=o.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,w=o.Ay.div`
  background-color: #131722;
  border: 1px solid #2a2e39;
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`,b=o.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #2a2e39;
  padding-bottom: 15px;
`,S=o.Ay.h2`
  margin: 0;
  color: #fff;
  font-size: 24px;
`,j=o.Ay.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #007bff;
  }
`,F=o.Ay.div`
  line-height: 1.6;

  h3 {
    color: #007bff;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 15px;
  }

  ul {
    margin-bottom: 15px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`,D=()=>{let[e,t]=(0,n.useState)("BTCUSDT"),[r,o]=(0,n.useState)([]),[a,c]=(0,n.useState)(),[h,f]=(0,n.useState)(!1),[d,D]=(0,n.useState)("1d"),y=()=>{f(!1)},k=(0,n.useCallback)(async(e,t,r)=>{try{let l=await i(e,t,r),n=await E(e,t);if(l){let r=await l.json();o(r);let a=(e=>{let t=e.length??0,r=[];for(let l=0;l<t;l++){let t=e[l][0]/1e3,n=0!==l?(r[l-1].open+r[l-1].close)/2:parseFloat(e[0][1]),o=(parseFloat(e[l][1])+parseFloat(e[l][2])+parseFloat(e[l][3])+parseFloat(e[l][4]))/4,a=Math.max(parseFloat(e[l][2]),n,o),i=Math.min(parseFloat(e[l][3]),n,o);r.push({timeFrame:t,open:n,high:a,low:i,close:o})}return r})(r);U(e,t,n,a)}}catch(e){throw console.log("market data host error: ",e),e}},[]),E=async(e,t)=>{let r=[];try{let l=new Response;if("BTCUSDT"===e&&("4d"===t&&(l=await fetch("/BTCUSDT/4D.csv")),"2d"===t&&(l=await fetch("/BTCUSDT/2D.csv")),"1d"===t&&(l=await fetch("/BTCUSDT/1D.csv")),"12h"===t&&(l=await fetch("/BTCUSDT/720.csv")),"8h"===t&&(l=await fetch("/BTCUSDT/480.csv")),"6h"===t&&(l=await fetch("/BTCUSDT/360.csv")),"4h"===t&&(l=await fetch("/BTCUSDT/240.csv")),"2h"===t&&(l=await fetch("/BTCUSDT/120.csv")),"1h"===t&&(l=await fetch("/BTCUSDT/60.csv")),"30m"===t&&(l=await fetch("/BTCUSDT/30.csv")),"15m"===t&&(l=await fetch("/BTCUSDT/15.csv"))),"ETHUSDT"===e&&("1d"===t&&(l=await fetch("/ETHUSDT/1D.csv")),"12h"===t&&(l=await fetch("/ETHUSDT/720.csv")),"8h"===t&&(l=await fetch("/ETHUSDT/480.csv")),"6h"===t&&(l=await fetch("/ETHUSDT/360.csv")),"4h"===t&&(l=await fetch("/ETHUSDT/240.csv")),"2h"===t&&(l=await fetch("/ETHUSDT/120.csv")),"1h"===t&&(l=await fetch("/ETHUSDT/60.csv")),"30m"===t&&(l=await fetch("/ETHUSDT/30.csv")),"15m"===t&&(l=await fetch("/ETHUSDT/15.csv")),"5m"===t&&(l=await fetch("/ETHUSDT/5.csv"))),!l.ok)throw Error(`HTTP Error: ${l.status}`);for(let e of(await l.text()).split("\n").map(e=>e.split(",")).splice(1))r.push({timeFrame:parseInt(e[0]),open:parseFloat(e[1]),high:parseFloat(e[2]),low:parseFloat(e[3]),close:parseFloat(e[4])})}catch(e){console.log("csv 파일로드 에러, ",e)}finally{return r}},U=(e,t,r,l)=>{r.forEach((n,o)=>{if(n.timeFrame===l[0].timeFrame){let n=[...r.splice(0,o),...l],a=[s(n,89),s(n,144),s(n,233),s(n,377),s(n,610),s(n,987),s(n,1597),s(n,2584),s(n,4181)],i=u(n,14,1);c({symbol:e,interval:t,heikin:((e,t)=>{let r=[...e],l=e.length;for(let n=0;n<l;n++){let l=Math.abs(e[n].open-e[n].close),o=e[n].high-Math.max(e[n].open,e[n].close),a=Math.min(e[n].open,e[n].close)-e[n].low;l<o&&l<a&&((t[n].value>70||t[n].value<30)&&(r[n]={...e[n],shiftInTrend:!0}),0!==n&&(t[n-1].value>70||t[n-1].value<30)&&(r[n]={...e[n],shiftInTrend:!0}))}return r})(((e,t)=>{if(e.length!==t.length)return console.log("Error, the emaDivergence stategy"),[];let r=[...e],l=e.length,n=-1,o=-1,a=!1;for(let i=0;i<l;i++)70<t[i].value&&0!==t[i].value&&(-1===n?n=i:t[n].value<t[i].value&&(n=i,o=-1,a=!1)),-1!==n&&t[i].value<=70&&(a=!0),o=-1!==n&&t[i].value>70&&a&&e[i].high>e[n].high?i:-1,30>=t[i].value&&(n=-1,o=-1,a=!1),-1!==n&&-1!==o&&a&&(r[i+1]={...e[i+1],lowwerDivergence:!0});return r})(((e,t)=>{if(e.length!==t.length)return console.log("Error, the emaDivergence stategy"),[];let r=[...e],l=e.length,n=-1,o=-1,a=!1;for(let i=0;i<l;i++)t[i].value<30&&0!==t[i].value&&(-1===n?n=i:t[i].value<t[n].value&&(n=i,o=-1,a=!1)),-1!==n&&30<=t[i].value&&(a=!0),o=-1!==n&&t[i].value<30&&a&&e[i].low<e[n].low?i:-1,70<=t[i].value&&(n=-1,o=-1,a=!1),-1!==n&&-1!==o&&a&&(r[i+1]={...e[i+1],upperDivergence:!0});return r})(n,i),i),i),ema:a,rsi:i})}})};return(0,n.useEffect)(()=>{k(e,d,6e4)},[d,k,e]),(0,l.jsxs)("div",{children:[(0,l.jsxs)(m,{children:[["1d","12h","8h","6h","4h","2h","1h","30m","15m"].map(e=>(0,l.jsx)(g,{onClick:()=>{D(e)},children:e},e)),(0,l.jsx)(x,{onClick:()=>t("BTCUSDT"),children:"BTCUSDT"}),(0,l.jsx)(x,{onClick:()=>t("ETHUSDT"),children:"ETHUSDT"}),(0,l.jsx)(v,{onClick:()=>{f(!0)},children:"도움말"})]}),(0,l.jsx)(p,{heikin:a?.heikin,ema:a?.ema,rsi:a?.rsi}),h&&(0,l.jsx)(T,{onClick:y,children:(0,l.jsxs)(w,{onClick:e=>e.stopPropagation(),children:[(0,l.jsxs)(b,{children:[(0,l.jsx)(S,{children:"차트 사용법"}),(0,l.jsx)(j,{onClick:y,children:"\xd7"})]}),(0,l.jsxs)(F,{children:[(0,l.jsx)("h3",{children:"기본 조작"}),(0,l.jsxs)("ul",{children:[(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"드래그:"})," 차트를 좌우로 스크롤할 수 있습니다."]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"휠:"})," 차트를 확대/축소할 수 있습니다 (지원예정)"]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"터치패드:"})," Mac 터치패드로도 동일한 조작이 가능합니다."]})]}),(0,l.jsx)("h3",{children:"차트 구성"}),(0,l.jsxs)("ul",{children:[(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"메인 차트:"})," 하이킨아시 캔들차트와 EMA 이동평균선"]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"RSI 차트:"})," 상대강도지수 (30 이하: 과매도, 70 이상: 과매수)"]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"색상 구분:"})," 녹색(양봉), 빨간색(음봉), 금색(다이버전스)"]})]}),(0,l.jsx)("h3",{children:"지표 설명"}),(0,l.jsxs)("ul",{children:[(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"EMA:"})," 지수이동평균선 (89, 144, 233, 377, 610, 987, 1597, 2584, 4181)"]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"RSI:"})," 14기간 상대강도지수"]}),(0,l.jsxs)("li",{children:[(0,l.jsx)("strong",{children:"다이버전스:"})," 가격과 RSI의 괴리 현상"]})]}),(0,l.jsx)("h3",{children:"시간대 선택"}),(0,l.jsx)("p",{children:"상단의 시간대 버튼을 클릭하여 1분부터 1일까지 다양한 시간대의 차트를 볼 수 있습니다."}),(0,l.jsx)("h3",{children:"코인 선택"}),(0,l.jsx)("p",{children:"BTCUSDT와 ETHUSDT 중 원하는 코인을 선택할 수 있습니다."}),(0,l.jsx)("h3",{children:"전략설명"}),(0,l.jsx)("p",{children:"몸통이 짧은 하이킨아시(도지캔들, 스타캔들)와 RSI다이버전스가 발생한 부분은 금색으로 표시되면, 해당부분을 진입 타점으로 볼 수 있습니다. 그러나 하이킨아시 차트는 시각적인 모양을 참고하기 때문에, 다이버전스 완성된 후, 하이킨아시 모양을 확인하고 진입해야합니다."})]})]})})]})}}},e=>{e.O(0,[774,441,964,358],()=>e(e.s=8506)),_N_E=e.O()}]);