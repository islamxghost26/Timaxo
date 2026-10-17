const r=require('../out/results.json');
// تصنيفي أنا بالعين على الـ18 صورة (مش تقييم المستخدم): أي قيمة في المصفوفة = مقبول
const lab={'20231228_124018':['card'],'20231228_124026':['hand','card'],'20241105_161232':['original'],'20241119_103942':['ink'],'20260122_201423':['original'],'20260123_111624':['original'],'20260812_075521':['ink'],'20260812_125053':['hand'],'20260812_125102':['hand'],'20260813_093222':['ink','print'],'20260816_201642':['hand'],'20261001_083849':null,'IMG-20240505-WA0001':['hand'],'IMG-20241117-WA0005':['card'],'IMG-20260606-WA0009':['original'],'IMG-20260930-WA0005':['ink','print'],'VideoCapture_20241117-203751':['card'],'image-1766092864151':['original']};
let ok=0,n=0;
for(const x of r){const k=x.name.replace('.jpg',''),L=lab[k];const good=L?L.includes(x.pick.f):null;if(L){n++;if(good)ok++;}
 console.log((good===null?'  ?':good?'  ✓':'  ✗'),k.padEnd(30),x.pick.f.padEnd(9),'(مرجع:',L?L.join('/'):'-',')',x.pick.whyAr,' ',x.pickMs+'ms');}
console.log(`\nمطابق لتصنيفي: ${ok}/${n}`);
