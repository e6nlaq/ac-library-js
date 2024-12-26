// ac-library-js - v0.0.1
class DSU{_n;parent_or_size;constructor(n=0){this._n=n,this.parent_or_size=new Int32Array(n).fill(-1)}merge(a,b){this.assertInRange(a),this.assertInRange(b);let x=this.leader(a),y=this.leader(b);if(x===y)return x;if(-this.parent_or_size[x]<-this.parent_or_size[y])[x,y]=[y,x];return this.parent_or_size[x]+=this.parent_or_size[y],this.parent_or_size[y]=x,x}same(a,b){return this.assertInRange(a),this.assertInRange(b),this.leader(a)===this.leader(b)}leader(a){if(this.assertInRange(a),this.parent_or_size[a]<0)return a;return this.parent_or_size[a]=this.leader(this.parent_or_size[a]),this.parent_or_size[a]}size(a){return this.assertInRange(a),-this.parent_or_size[this.leader(a)]}groups(){let leaderBuf=new Int32Array(this._n).map((_,i)=>this.leader(i)),groupSize=new Int32Array(this._n);for(let leader of leaderBuf)groupSize[leader]++;let result=Array.from({length:this._n},()=>[]);for(let i=0;i<this._n;i++)result[leaderBuf[i]].push(i);return result.filter((group)=>group.length>0)}assertInRange(a){if(a<0||a>=this._n)throw new RangeError(`Index ${a} is out of range`)}}function safe_mod(x,m){if(x%=m,x<0n)x+=m;return x}class Barrett{_m;im;constructor(m){if(m<=0)throw new Error("m must be positive");this._m=m,this.im=(2n**64n-1n)/BigInt(m)+1n}umod(){return this._m}mul(a,b){return Number(BigInt(a)*BigInt(b)%BigInt(this._m))}}function inv_gcd(a,b){if(a=(a%b+b)%b,a===0n)return[b,0n];let s=b,t=a,m0=0n,m1=1n;while(t!==0n){let u=s/t;s-=t*u,m0-=m1*u;let tmp=s;s=t,t=tmp,tmp=m0,m0=m1,m1=tmp}if(m0<0)m0+=b/s;return[s,m0]}function floor_sum_unsigned(n,m,a,b){let ans=0n;while(!0){if(a>=m)ans+=n*(n-1n)/2n*(a/m),a%=m;if(b>=m)ans+=n*(b/m),b%=m;let y_max=a*n+b;if(y_max<m)break;n=y_max/m,b=y_max%m,[m,a]=[a,m]}return ans}function pow_mod(x,n,m){if(x=BigInt(x),n=BigInt(n),n<0n)throw new RangeError("n must be 0<=n");if(m<1n)throw new RangeError("m must be 1<=m");if(m===1)return 0n;let bt=new Barrett(m),r=1,y=Number(safe_mod(x,BigInt(m)));while(n){if(n&1n)r=bt.mul(r,y);y=bt.mul(y,y),n>>=1n}return BigInt(r)}function inv_mod(x,m){if(x=BigInt(x),m=BigInt(m),m<1n)throw new RangeError("m must be 1<=m");let z=inv_gcd(x,m);if(z[0]!==1n)throw new RangeError("gcd(x,m) must be 1");return z[1]}function crt(r,m){if(Array.isArray(r))r=new BigInt64Array(r);if(Array.isArray(m))m=new BigInt64Array(m);if(r.length!==m.length)throw new RangeError("|r| and |m| must be the same");let n=Number(r.length),r0=0n,m0=1n;for(let i=0;i<n;i++){if(m[i]<1n)throw new RangeError("m[i] must be 1<=m[i]");let r1=safe_mod(r[i],m[i]),m1=m[i];if(m0<m1)[r0,r1]=[r1,r0],[m0,m1]=[m1,m0];if(m0%m1===0n){if(r0%m1!==r1)return[0n,0n];continue}let[g,im]=inv_gcd(m0,m1),u1=m1/g;if((r1-r0)%g)return[0n,0n];let x=(r1-r0)/g%u1*im%u1;if(r0+=x*m0,m0*=u1,r0<0n)r0+=m0}return[r0,m0]}function floor_sum(n,m,a,b){if(n=BigInt(n),m=BigInt(m),a=BigInt(a),b=BigInt(b),!(0n<=n&&n<1n<<32n))throw new RangeError("n must be 0<=n<2^32");if(!(0n<=m&&m<1n<<32n))throw new RangeError("m must be 0<=m<2^32");let ans=0n;if(a<0n){let a2=safe_mod(a,m);ans-=n*(n-1n)/2n*((a2-a)/m),a=a2}if(b<0n){let b2=safe_mod(b,m);ans-=n*((b2-b)/m),b=b2}return ans+floor_sum_unsigned(n,m,a,b)}function bit_ceil(n){let x=1;while(x<n)x*=2;return x}function countr_zero(n){if(n===0)return Math.floor(Math.log2(Number.MAX_SAFE_INTEGER));let ans=0;while(!(n&1))ans++,n>>=1;return ans}class Segtree{op;e;_n;size;log;d;update(k){this.d[k]=this.op(this.d[2*k],this.d[2*k+1])}range_assert(x,right=!1){if(x<0||x>=this._n+Number(right))throw new RangeError("Index out of range")}constructor(op,e,x=0,option={arr:Array}){this.op=op,this.e=e;let v;if(typeof x==="number"){v=new option.arr(x);for(let i=0;i<x;i++)v[i]=this.e()}else v=x;this._n=v.length,this.size=bit_ceil(this._n),this.log=countr_zero(this.size),this.d=new option.arr(2*this.size);for(let i=0;i<this.d.length;i++)this.d[i]=this.e();for(let i=0;i<this._n;i++)this.d[this.size+i]=v[i];for(let i=this.size-1;i>=1;i--)this.update(i)}set(p,x){this.range_assert(p),p+=this.size,this.d[p]=x;for(let i=1;i<=this.log;i++)this.update(p>>i)}get(p){return this.range_assert(p),this.d[p+this.size]}prod(l,r){if(!(0<=l&&l<=r&&r<=this._n))throw new RangeError(`Not 0 <= l <= r <= ${this._n}`);let sml=this.e(),smr=this.e();l+=this.size,r+=this.size;while(l<r){if(l&1)sml=this.op(sml,this.d[l++]);if(r&1)smr=this.op(this.d[--r],smr);l>>=1,r>>=1}return this.op(sml,smr)}all_prod(){return this.d[1]}max_right(l,f){if(this.range_assert(l,!0),!f(this.e()))throw new Error("f(e()) must be true.");if(l===this._n)return this._n;l+=this.size;let sm=this.e();do{while(l%2===0)l>>=1;if(!f(this.op(sm,this.d[l]))){while(l<this.size)if(l*=2,f(this.op(sm,this.d[l])))sm=this.op(sm,this.d[l]),l++;return l-this.size}sm=this.op(sm,this.d[l]),l++}while((l&-l)!==l);return this._n}min_left(r,f){if(this.range_assert(r,!0),!f(this.e()))throw new Error("f(e()) must be true.");if(r===0)return 0;r+=this.size;let sm=this.e();do{r--;while(r>1&&r%2)r>>=1;if(!f(this.op(this.d[r],sm))){while(r<this.size)if(r=2*r+1,f(this.op(this.d[r],sm)))sm=this.op(this.d[r],sm),r--;return r+1-this.size}sm=this.op(this.d[r],sm)}while((r&-r)!==r);return 0}}class CSR{start;elist;constructor(n,edges){this.start=new Int32Array(n+1),this.elist=new Array(edges.length);for(let[v,_]of edges)this.start[v+1]++;for(let i=1;i<=n;i++)this.start[i]+=this.start[i-1];let counter=this.start.slice();for(let[v,e]of edges)this.elist[counter[v]++]=e}}class InternalSCCGraph{_n;edges;constructor(n){this._n=n,this.edges=[]}num_vertices(){return this._n}add_edge(from,to){this.edges.push([from,{to}])}scc_ids(){let g=new CSR(this._n,this.edges),now_ord=0,group_num=0,visited=[],low=new Int32Array(this._n),ord=new Int32Array(this._n).fill(-1),ids=new Int32Array(this._n),dfs=(v)=>{low[v]=ord[v]=now_ord++,visited.push(v);for(let i=g.start[v];i<g.start[v+1];i++){let to=g.elist[i].to;if(ord[to]===-1)dfs(to),low[v]=Math.min(low[v],low[to]);else low[v]=Math.min(low[v],ord[to])}if(low[v]===ord[v]){while(!0){let u=visited[visited.length-1];if(visited.pop(),ord[u]=this._n,ids[u]=group_num,u===v)break}group_num++}};for(let i=0;i<this._n;i++)if(ord[i]===-1)dfs(i);for(let i=0;i<this._n;i++)ids[i]=group_num-1-ids[i];return[group_num,ids]}scc(){let[group_num,ids]=this.scc_ids(),counts=new Int32Array(group_num);for(let id of ids)counts[id]++;let groups=new Array(group_num).fill([]).map(()=>[]);for(let i=0;i<this._n;i++)groups[ids[i]].push(i);return groups}}class SCCGraph{internal;constructor(n=0){this.internal=new InternalSCCGraph(n)}add_edge(from,to){let n=this.internal.num_vertices();if(!(0<=from&&from<n&&0<=to&&to<n))throw new RangeError("Out of range");this.internal.add_edge(from,to)}scc(){return this.internal.scc()}}class TwoSat{_n;_answer;scc;constructor(n=0){this._n=n,this._answer=new Array(n),this.scc=new InternalSCCGraph(2*n)}add_clause(i,f,j,g){if(!(0<=i&&i<this._n&&0<=j&&j<this._n))throw new RangeError("Out of range");this.scc.add_edge(2*i+(f?0:1),2*j+(g?1:0)),this.scc.add_edge(2*j+(g?0:1),2*i+(f?1:0))}satisfiable(){let id=this.scc.scc_ids()[1];for(let i=0;i<this._n;i++){if(id[2*i]===id[2*i+1])return!1;this._answer[i]=id[2*i]<id[2*i+1]}return!0}answer(){return this._answer}}export{pow_mod,inv_mod,floor_sum,crt,TwoSat,Segtree,SCCGraph,DSU};