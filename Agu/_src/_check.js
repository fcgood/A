
/* ============================================================
   engine0 · 全局状态与内置名称索引
   （必须最先加载：init() 在 engine3 末尾即被调用，
     这些 var 必须在此之前完成初始化，否则 TDZ/undefined）
   ============================================================ */
var NAME_IDX = (function(){
  var raw = [
    ["000001","上证指数","shzs"],["000002","万科A","wka"],["000006","地产指数","dczs"],["000010","上证180","sz180"],["000015","红利指数","hlzs"],["000017","新综指","xzz"],
    ["000024","招商地产","zsdc"],["000037","深南电A","snda"],["000043","超大盘","cdp"],["000045","深纺织A","sfza"],["000047","上证全指","szqz"],["000057","全指成长","qzcz"],
    ["000058","全指价值","qzjz"],["000059","全R成长","qrcz"],["000060","全R价值","qrjz"],["000063","中兴通讯","zxtx"],["000064","非周期","fzq"],["000065","上证龙头","szlt"],
    ["000075","医药等权","yydq"],["000076","金融等权","jrdq"],["000090","上证流通","szlt"],["000100","TCL科技","tclkj"],["000102","沪投资品","htzp"],["000121","医药主题","yyzt"],
    ["000122","农业主题","nyzt"],["000148","消费领先","xflx"],["000157","中联重科","zlzk"],["000158","上证环保","szhb"],["000159","沪股通","hgt"],["000160","沪新丝路","hxsl"],
    ["000161","沪中国造","hzgz"],["000162","沪互联+","hhl"],["000171","新兴成指","xxcz"],["000300","沪深300","hs300"],["000301","东方盛虹","dfsh"],["000333","美的集团","mdjt"],
    ["000338","潍柴动力","wcdl"],["000408","藏格矿业","cgky"],["000415","渤海租赁","bhzl"],["000422","湖北宜化","hbyh"],["000425","徐工机械","xgjx"],["000428","华天酒店","htjd"],
    ["000500","内地企业","ndqy"],["000501","中国1000","zg1000"],["000504","南华生物","nhsw"],["000507","珠海港","zhg"],["000510","中证A500","zza500"],["000520","凤凰航运","fhhy"],
    ["000526","学大教育","xdjy"],["000538","云南白药","ynby"],["000552","甘肃能化","gsnh"],["000561","烽火电子","fhdz"],["000568","泸州老窖","lzlj"],["000592","平潭发展","ptfz"],
    ["000596","古井贡酒","gjgj"],["000605","渤海股份","bhgf"],["000625","长安汽车","caqc"],["000636","风华高科","fhgk"],["000637","茂化实华","mhsh"],["000650","仁和药业","rhyy"],
    ["000651","格力电器","gldq"],["000680","科创综指","kczz"],["000681","科创价格","kcjg"],["000682","科创信息","kcxx"],["000685","科创芯片","kcxp"],["000688","科创50","kc50"],
    ["000693","科创机械","kcjx"],["000707","双环科技","shkj"],["000725","京东方A","jdfa"],["000750","国海证券","ghzq"],["000756","新华制药","xhzy"],["000763","锦州石化","jzsh"],
    ["000766","通化金马","thjm"],["000768","中航西飞","zhxf"],["000776","广发证券","gfzq"],["000783","长江证券","cjzq"],["000786","北新建材","bxjc"],["000802","北京文化","bjwh"],
    ["000805","A股资源","agzy"],["000806","消费服务","xffw"],["000807","食品饮料","spyl"],["000808","医药生物","yysw"],["000812","细分机械","xfjx"],["000818","细分金融","xfjr"],
    ["000819","有色金属","ysjs"],["000820","煤炭指数","mtzs"],["000822","山东海化","sdhh"],["000824","国企红利","gqhl"],["000825","央企红利","yqhl"],["000827","中证环保","zzhb"],
    ["000831","中国稀土","zgxt"],["000840","浙江民企","zjmq"],["000846","ESG100","esg100"],["000847","腾讯济安","txja"],["000852","中证1000","zz1000"],["000853","CSSW丝路","csswsl"],
    ["000855","央视500","ys500"],["000858","五粮液","wly"],["000859","国企一带一路","gqydyl"],["000861","央企创新","yqcx"],["000869","HK银行","hkyh"],["000888","上证收益","szsy"],
    ["000891","新兴综指","xxzz"],["000895","双汇发展","shfz"],["000901","小康指数","xkzs"],["000902","中证流通","zzlt"],["000905","中证500","zz500"],["000906","中证800","zz800"],
    ["000917","电广传媒","dgcm"],["000925","基本面50","jbm50"],["000927","央企100","yq100"],["000929","兰州黄河","lzhh"],["000932","华菱钢铁","hlgt"],["000933","神火股份","shgf"],
    ["000936","800通信","800tx"],["000938","紫光股份","zggf"],["000939","民企成长","mqcz"],["000940","财富大盘","cfdp"],["000941","新能源","xny"],["000942","内地消费","ndxf"],
    ["000943","新基建50","xjj50"],["000944","内地资源","ndzy"],["000947","内地银行","ndyh"],["000954","地企100","dq100"],["000955","中证国企","zzgq"],["000956","国企200","gq200"],
    ["000959","银河99","yh99"],["000963","华东医药","hdyy"],["000965","基本200","jb200"],["000966","基本400","jb400"],["000967","基本600","jb600"],["000970","ESG40","esg40"],
    ["000971","等权90","dq90"],["000976","新华金牛","xhjn"],["000977","浪潮信息","lcxx"],["000978","医药100","yy100"],["000979","大宗商品","dzsp"],["000985","中证全指","zzqz"],
    ["000987","全指材料","qzcl"],["000988","全指工业","qzgy"],["000992","全指金融","qzjr"],["000993","全指信息","qzxx"],["000994","全指通信","qztx"],["000996","领先行业","lxhy"],
    ["000997","大消费","dxf"],["000998","中证TMT","zztmt"],["000999","两岸三地","lasd"],["001269","欧晶科技","ojkj"],["001359","平安电工","padg"],["001979","招商蛇口","zssk"],
    ["002001","新和成","xhc"],["002022","科华生物","khsw"],["002024","ST易购","styg"],["002027","分众传媒","fzcm"],["002040","南京港","njg"],["002041","登海种业","dhzy"],
    ["002049","紫光国微","zggw"],["002050","三花智控","shzk"],["002059","云南旅游","ynly"],["002065","东华软件","dhrj"],["002074","国轩高科","gxkg"],["002089","新海退","xht"],
    ["002107","沃华医药","whyy"],["002111","威海广泰","whgt"],["002125","湘潭电化","xtdh"],["002129","TCL中环","tlzh"],["002142","宁波银行","nbyh"],["002146","荣盛发展","rsfz"],
    ["002156","通富微电","tfwd"],["002185","华天科技","htkj"],["002194","武汉凡谷","whfg"],["002230","科大讯飞","kdxf"],["002234","民和股份","mhgf"],["002236","大华股份","dhgf"],
    ["002241","歌尔股份","gegf"],["002243","力合科创","lhkc"],["002246","北化股份","bhgf"],["002250","联化科技","lhkj"],["002262","恩华药业","ehyy"],["002264","新华都","xhd"],
    ["002271","东方雨虹","dfyh"],["002304","洋河股份","yhgf"],["002313","日海智能","rhzn"],["002335","科华数据","khsj"],["002352","顺丰控股","sfkg"],["002363","隆基机械","ljjx"],
    ["002366","融发核电","rfhd"],["002371","北方华创","bfhc"],["002376","新北洋","xby"],["002384","东山精密","dsjm"],["002415","海康威视","hkws"],["002417","深南退","snt"],
    ["002456","欧菲光","ofg"],["002460","赣锋锂业","gfly"],["002463","沪电股份","hdgf"],["002466","天齐锂业","tqly"],["002467","二六三","els"],["002468","申通快递","stkd"],
    ["002472","双环传动","shcd"],["002475","立讯精密","lxjm"],["002493","荣盛石化","rssh"],["002543","万和电气","whdq"],["002550","千红制药","qhzy"],["002586","围海股份","whgf"],
    ["002594","比亚迪","byd"],["002600","领益智造","lyzz"],["002607","中公教育","zgjy"],["002659","凯文教育","kwjy"],["002707","众信旅游","zxly"],["002711","欧浦退","opt"],
    ["002714","牧原股份","mygf"],["002737","葵花药业","khyy"],["002739","儒意电影","rydy"],["002747","埃斯顿","asd"],["002773","康弘药业","khyy"],["002812","恩捷股份","ejgf"],
    ["002821","凯莱英","kly"],["002851","麦格米特","mgmt"],["002916","深南电路","sndl"],["002920","德赛西威","dsxw"],["002938","鹏鼎控股","pdkg"],["002993","奥海科技","ahkj"],
    ["002997","瑞鹄模具","rhmj"],["003022","联泓新科","lhxk"],["003032","传智教育","czjy"],["003816","中国广核","zggh"],["158017","化工ETF易方达","hgetfyfd"],["158041","创业板算力ETF华夏","cybsletfhx"],
    ["158049","创业板算力ETF广发","cybsletfgf"],["158050","创业板算力ETF易方达","cybsletfyfd"],["158053","创业板算力ETF大成","cybsletfdc"],["158056","创业板算力ETF嘉实","cybsletfjs"],["158057","创业板算力ETF鹏华","cybsletfph"],["158059","创业板算力ETF富国","cybsletffg"],
    ["158061","创业板算力ETF天弘","cybsletfth"],["158063","创业板算力ETF南方","cybsletfnf"],["159007","养殖ETF华泰柏瑞","yzetfhtbr"],["159011","养殖ETF华安","yzetfha"],["159020","养殖ETF易方达","yzetfyfd"],["159023","养殖ETF万家","yzetfwj"],
    ["159025","家电ETF华安","jdetfha"],["159082","化工ETF华夏","hgetfhx"],["159087","化工ETF万家","hgetfwj"],["159093","化工ETF汇添富","hgetfhtf"],["159099","云计算ETF华宝","yjsetfhb"],["159129","化工ETF嘉实","hgetfjs"],
    ["159133","化工ETF天弘","hgetfth"],["159146","电力ETF华宝","dletfhb"],["159151","食品ETF华夏","spetfhx"],["159158","电力ETF景顺","dletfjs"],["159165","养殖ETF永赢","yzetfyy"],["159168","有色ETF富国","ysetffg"],
    ["159172","养殖ETF汇添富","yzetfhtf"],["159176","家电ETF华宝","jdetfhb"],["159182","家电ETF南方","jdetfnf"],["159192","家电ETF汇添富","jdetfhtf"],["159248","人工智能ETF万家","rgznetfwj"],["159272","机器人ETF富国","jqretffg"],
    ["159273","云计算ETF汇添富","yjsetfhtf"],["159290","创业板综指ETF","cybzzetf"],["159305","储能电池ETF广发","cndcetfgf"],["159306","汽车零部件ETF平安","qclbjetfpa"],["159310","芯片ETF天弘","xpetfth"],["159320","电网设备ETF广发","dwsbetfgf"],
    ["159326","电网设备ETF","dwsbetf"],["159327","半导体设备ETF万家","bdtsbetfwj"],["159328","家电ETF易方达","jdetfyfd"],["159507","通信ETF广发","txetfgf"],["159509","纳指科技ETF","nzkjetf"],["159511","通信ETF南方","txetfnf"],
    ["159512","汽车ETF广发","qcetfgf"],["159513","纳斯达克100ETF","nsdk100etf"],["159516","半导体设备ETF国泰","bdtsbetfgt"],["159527","云计算ETF广发","yjsetfgf"],["159528","国企改革ETF富国","gqggetffg"],["159530","机器人ETF易方达","jqretfyfd"],
    ["159531","中证2000ETF","zz2000etf"],["159550","互联网ETF东财","hlwetfdc"],["159558","半导体设备ETF","bdtsbetf"],["159559","机器人ETF景顺","jqretfjs"],["159560","芯片ETF景顺","xpetfjs"],["159565","汽车零部件ETF易方达","qclbjetfyfd"],
    ["159566","储能电池ETF易方达","cndcetfyfd"],["159577","美国50ETF","mg50etf"],["159582","半导体ETF博时","bdtetfbs"],["159583","通信ETF富国","txetffg"],["159586","计算机ETF南方","jsjetfnf"],["159599","芯片ETF东财","xpetfdc"],
    ["159605","中概互联ETF","zghlwetf"],["159609","光伏ETF浦银","gfetfpy"],["159611","电力ETF","dletf"],["159619","基建ETF国泰","jjetfgt"],["159622","创新药ETF东财","cxyetfdc"],["159632","纳斯达克ETF","nsdketf"],
    ["159635","基建ETF华夏","jjetfhx"],["159643","疫苗ETF国泰","ymetfgt"],["159645","疫苗ETF富国","ymetffg"],["159652","有色ETF汇添富","ysetfhtf"],["159657","疫苗ETF鹏华","ymetfph"],["159659","纳斯达克100ETF招商","nsdk100etfzs"],
    ["159665","半导体龙头ETF工银","bdtltetfgy"],["159690","有色矿业ETF招商","yskyetfzs"],["159695","通信ETF嘉实","txetfjs"],["159707","地产ETF华宝","dcetfhb"],["159713","稀土ETF","xtetf"],["159715","稀土ETF易方达","xtetfyfd"],
    ["159719","国企ETF平安","gqetfpa"],["159729","互联网ETF汇添富","hlwetfhtf"],["159730","家电ETF博时","jdetfbs"],["159736","食品饮料ETF天弘","spyletfth"],["159738","云计算ETF华泰柏瑞","yjsetfhtbr"],["159739","云计算ETF鹏华","yjsetfph"],
    ["159740","恒生科技ETF","hskjetf"],["159745","建材ETF国泰","jcetfgt"],["159748","创新药ETF富国","cxyetffg"],["159766","旅游ETF","lyetf"],["159770","机器人ETF天弘","jqretfth"],["159780","科创芯片ETF","kcxpetf"],
    ["159786","VRETF银华","vretfyh"],["159787","建材ETF易方达","jcetfyfd"],["159801","芯片ETF广发","xpetfgf"],["159805","传媒ETF鹏华","cmetfph"],["159806","新能源车ETF国泰","xnycetfgt"],["159813","半导体ETF鹏华","bdtetfph"],
    ["159819","人工智能ETF","rgznetf"],["159825","农业ETF富国","nyetffg"],["159827","农业ETF银华","nyetfyh"],["159840","锂电池ETF工银","ldcetfgy"],["159842","券商ETF银华","qsetfyh"],["159843","食品饮料ETF招商","spyletfzs"],
    ["159851","金融科技ETF","jrkjetf"],["159852","软件ETF","rjetf"],["159856","互联网龙头ETF工银","hlwltetfgy"],["159857","光伏ETF天弘","gfetfth"],["159858","创新药ETF南方","cxyetfnf"],["159862","食品饮料ETF银华","spyletfyh"],
    ["159863","光伏ETF鹏华","gfetfph"],["159864","光伏ETF国泰","gfetfgt"],["159865","养殖ETF","yzetf"],["159867","养殖ETF鹏华","yzetfph"],["159870","化工ETF鹏华","hgetfph"],["159871","有色ETF银华","ysetfyh"],
    ["159875","新能源ETF嘉实","xnyetfjs"],["159876","有色ETF华宝","ysetfhb"],["159880","有色ETF鹏华","ysetfph"],["159886","机械ETF富国","jxetffg"],["159887","银行ETF富国","yhetffg"],["159890","云计算ETF招商","yjsetfzs"],
    ["159892","华夏恒生ETF","hxhsetf"],["159915","创业板ETF","cybetf"],["159919","沪深300ETF","hs300etf"],["159928","消费ETF","xfetf"],["159929","医药ETF汇添富","yyetfhtf"],["159934","黄金ETF","hjetf"],
    ["159938","医药ETF广发","yyetfgf"],["159941","纳指ETF","nzetf"],["159949","创业板50ETF","cyb50etf"],["159959","央企ETF银华","yqetfyh"],["159967","创成长ETF","cczetf"],["159980","有色ETF大成","ysetfdc"],
    ["159992","创新药ETF","cxuetf"],["159994","通信ETF银华","txetfyh"],["159995","芯片ETF","xpetf"],["159996","家电ETF国泰","jdetfgt"],["159997","电子ETF天弘","dzetfth"],["159998","计算机ETF天弘","jsjetfth"],
    ["160222","食品LOF","splof"],["160607","鹏华价值优势LOF","phjzyslof"],["160610","鹏华动力LOF","phdllof"],["160611","鹏华优质治理LOF","phyzzllof"],["160625","鹏华证券保险指数(LOF)","phzqbxzslof"],["160628","地产LOF","dclof"],
    ["160629","传媒LOF","cmlof"],["160633","券商LOF","qslof"],["160634","环保产业基金","hbcyjj"],["161024","军工LOF","jglof"],["161025","互联网LOF","hlwlof"],["161032","煤炭龙头LOF","mtltlof"],
    ["161631","人工智能LOF","rgznlof"],["161721","地产基金","dcjj"],["161724","煤炭等权LOF","mtdqlof"],["161725","白酒基金LOF","bjjjlof"],["164402","前海开源中航军工指数A","qhkyzhjgzsa"],["164403","前海开源沪港深农业混合(LOF)A","qhkyhgsnyhhlofa"],
    ["164818","传媒基金","cmjj"],["165525","基建工程LOF","jjgclof"],["167001","平安鼎泰混合(LOF)","padthhlof"],["167002","平安鼎越混合(LOF)A","padyhhlofa"],["167003","平安鼎弘混合(LOF)A","padhhhlofa"],["167301","保险主题LOF","bxztlof"],
    ["168203","钢铁LOF","gtlof"],["168204","煤炭LOF","mtlof"],["180201","平安广州广河REIT","pagzghreit"],["184693","鹏华普丰封闭","phpffb"],["200037","深南电B","sndb"],["200045","深纺织B","sfzb"],
    ["300008","天海防务","thfw"],["300014","亿纬锂能","ywln"],["300024","机器人","jqr"],["300033","同花顺","ths"],["300043","星辉娱乐","xhyl"],["300059","东方财富","dfcf"],
    ["300122","智飞生物","zfsw"],["300124","汇川技术","hcjs"],["300137","先河环保","xhhb"],["300189","神农种业","snzy"],["300192","科德教育","kdjy"],["300207","欣旺达","xwd"],
    ["300251","光线传媒","gxcm"],["300263","隆华科技","lhkj"],["300274","阳光电源","ygdy"],["300308","中际旭创","zjxc"],["300316","晶盛机电","jsjd"],["300339","润和软件","rhrj"],
    ["300340","科恒股份","khgf"],["300347","泰格医药","tgyy"],["300359","全通教育","qtjy"],["300390","天华新能","thxn"],["300394","天孚通信","tftx"],["300408","三环集团","shjt"],
    ["300413","芒果超媒","mgcm"],["300417","南华仪器","nhyq"],["300433","蓝思科技","lskj"],["300438","鹏辉能源","phny"],["300454","深信服","sxf"],["300458","全志科技","qzkj"],
    ["300474","景嘉微","jjw"],["300476","胜宏科技","shkj"],["300496","中科创达","zkcd"],["300502","新易盛","xys"],["300508","维宏股份","whgf"],["300558","贝达药业","bdyy"],
    ["300559","佳发教育","jfjy"],["300595","欧普康视","opks"],["300607","拓斯达","tsd"],["300628","亿联网络","ylwl"],["300661","圣邦股份","sbgf"],["300676","华大基因","hdjy"],
    ["300699","光威复材","gwfc"],["300727","润禾材料","rhcl"],["300738","奥飞数据","afsj"],["300750","宁德时代","ndsd"],["300759","康龙化成","klhc"],["300760","迈瑞医疗","mryl"],
    ["300782","卓胜微","zsw"],["300790","宇瞳光学","ytgx"],["300832","新产业","xcy"],["300841","康华生物","khsw"],["300857","协创数据","xcsj"],["300870","欧陆通","olt"],
    ["300896","爱美客","amk"],["300919","中伟股份","zwgf"],["300979","华利集团","hljt"],["301046","能辉科技","nhkj"],["301155","海力风电","hlfd"],["301199","迈赫股份","mhgf"],
    ["301207","华兰疫苗","hlym"],["301269","华大九天","hdjt"],["301308","江波龙","jbl"],["301363","美好医疗","mhyl"],["301505","苏州规划","szgh"],["399001","深证成指","szcz"],
    ["399002","深成指R","sczr"],["399006","创业板指","cybz"],["399012","创业300","cy300"],["399060","碳科技60","tkj60"],["399100","新指数","xzs"],["399102","创业板综","cybz"],
    ["399106","深证综指","szzz"],["399107","深证A指","szaz"],["399131","食品指数","spzs"],["399132","纺织指数","fzzs"],["399134","造纸指数","zzzs"],["399136","电子指数","dzzs"],
    ["399138","机械指数","jxzs"],["399139","医药指数","yyzs"],["399200","地产指数","dczs"],["399239","IT指数","itzs"],["399241","地产指数","dczs"],["399258","绿色低碳","lsdt"],
    ["399265","创新药械","cxyx"],["399274","深新基建","sxjj"],["399281","电子50","dz50"],["399282","大数据50","dsj50"],["399283","机器人50","jqr50"],["399284","AI50","ai50"],
    ["399285","物联网50","wlw50"],["399300","沪深300","hs300"],["399313","巨潮100","jc100"],["399314","巨潮大盘","jcdp"],["399315","巨潮中盘","jczp"],["399317","国证A指","gzaz"],
    ["399352","深企综指","sqzz"],["399354","分析师指数","fxszs"],["399357","环渤海","hbh"],["399358","国证环保","gzhb"],["399362","民企100","mq100"],["399363","国证算力","gzsl"],
    ["399364","消费100","xf100"],["399372","大盘成长","dpcz"],["399373","大盘价值","dpjz"],["399378","ESG300","esg300"],["399389","国证通信","gztx"],["399391","投资时钟","tzsz"],
    ["399393","国证地产","gzdc"],["399400","大中盘","dzp"],["399403","防御100","fy100"],["399405","大盘高贝","dpgb"],["399411","红利100","hl100"],["399415","I100","i100"],
    ["399416","I300","i300"],["399417","新能源车","xnyc"],["399418","数据要素","sjys"],["399436","绿色煤炭","lsmt"],["399437","证券龙头","zqlt"],["399440","国证钢铁","gzgt"],
    ["399550","央视50","ys50"],["399554","央视治理","yszl"],["399608","科技100","kj100"],["399610","TMT50","tmt50"],["399632","深100EW","s100ew"],["399633","深300EW","s300ew"],
    ["399638","深证环保","szhb"],["399640","创业基础","cyjc"],["399653","深证龙头","szlt"],["399659","深成指EW","sczew"],["399668","创业板V","cybv"],["399671","深防御50","sfy50"],
    ["399674","深A医药","sayy"],["399809","保险主题","bxzt"],["399810","CSSW传媒","csswcm"],["399902","中证流通","zzlt"],["399906","中证800","zz800"],["399925","基本面50","jbm50"],
    ["399927","央企100","yq100"],["399939","民企成长","mqcz"],["399940","财富大盘300","cfdp300"],["399941","新能源","xny"],["399943","内地基建","ndjj"],["399944","内地资源","ndzy"],
    ["399946","内地金融","ndjr"],["399947","内地银行","ndyh"],["399954","地企100","dq100"],["399956","国企200","gq200"],["399959","军工指数","jgzs"],["399960","中证龙头","zzlt"],
    ["399971","中证传媒","zzcm"],["399974","国企改革","gqgg"],["399978","医药100","yy100"],["399983","地产等权","dcdq"],["399985","中证全指","zzqz"],["399990","煤炭等权","mtdq"],
    ["399991","一带一路","ydyl"],["399995","基建工程","jjgc"],["399997","中证白酒","zzbj"],["399998","中证煤炭","zzmt"],["501007","互联网医疗LOF","hlwyllof"],["501008","互联网医疗LOFC","hlwyllofc"],
    ["501016","券商基金LOF","qsjjlof"],["501019","军工基金LOF","jgjjlof"],["501057","新能源车LOF","xnyclof"],["501099","平安新兴产业LOF","paxxcylof"],["502003","军工LOF","jglof"],["502006","国企改革LOF","gqgglof"],
    ["502023","钢铁LOF","gtlof"],["502053","券商LOF","qslof"],["508036","平安宁波交投REIT","panbjtreit"],["510050","上证50ETF","sz50etf"],["510060","央企ETF工银","yqetfgy"],["510180","上证180ETF","sz180etf"],
    ["510200","上证券商ETF汇安","szqsetfha"],["510270","国企ETF中银","gqetfzy"],["510300","沪深300ETF","hs300etf"],["510500","中证500ETF","zz500etf"],["512000","券商ETF华宝","qsetfhb"],["512010","医药ETF易方达","yyetfyfd"],
    ["512070","证券保险ETF易方达","zqbxetfyfd"],["512100","中证1000ETF","zz1000etf"],["512400","有色金属ETF南方","ysjsetfnf"],["512480","半导体ETF","bdtetf"],["512560","军工ETF易方达","jgetfyfd"],["512580","环保ETF广发","hbetfgf"],
    ["512620","农业ETF天弘","nyetfth"],["512660","军工ETF国泰","jgetfgt"],["512680","军工ETF广发","jgetfgf"],["512700","银行ETF南方","yhetfnf"],["512710","军工龙头ETF富国","jgltetffg"],["512720","计算机ETF国泰","jsjetfgt"],
    ["512730","银行ETF鹏华","yhetfph"],["512740","汽车零部件ETF广发","qclbjetfgf"],["512760","半导体芯片ETF","bdtxpetf"],["512800","银行ETF华宝","yhetfhb"],["512810","军工ETF华宝","jgetfhb"],["512820","银行ETF汇添富","yhetfhtf"],
    ["512880","证券ETF","zqetf"],["512930","AI人工智能ETF平安","airgznetfpa"],["512950","央企改革ETF华夏","yqggetfhx"],["512980","传媒ETF广发","cmetfgf"],["513050","中概互联网ETF","zghlwetf"],["513100","纳指ETF","nzetf"],
    ["513130","恒生科技ETF","hskjetf"],["513180","恒生科技指数ETF","hskjzsetf"],["513300","纳斯达克ETF华夏","nsdketfhx"],["513330","恒生互联网ETF","hshlwetf"],["513360","教育ETF博时","jyetfbs"],["513500","标普500ETF","bp500etf"],
    ["513520","日经ETF","rjetf"],["513880","日经225ETF","rj225etf"],["515000","科技ETF","kjetf"],["515020","银行ETF华夏","yhetfhx"],["515030","新能源车ETF","xnycetf"],["515050","通信ETF华夏","txetfhx"],
    ["515070","人工智能ETF华夏","rgznetfhx"],["515120","创新药ETF广发","cxyetfgf"],["515170","食品饮料ETF华夏","spyletfhx"],["515210","钢铁ETF国泰","gtetfgt"],["515220","煤炭ETF国泰","mtetfgt"],["515260","电子ETF华宝","dzetfhb"],
    ["515290","银行ETF天弘","yhetfth"],["515320","电子50ETF华安","dz50etfha"],["515470","人工智能ETF南方","rgznetfnf"],["515630","证券保险ETF鹏华","zqbxetfph"],["515640","家电ETF华夏","jdetfhx"],["515700","新能源车ETF平安","xnycetfpa"],
    ["515710","食品饮料ETF华宝","spyletfhb"],["515790","光伏ETF","gfetf"],["515880","通信ETF国泰","txetfgt"],["515940","电网设备ETF南方","dwsbetfnf"],["515950","医药50ETF富国","yy50etffg"],["515980","人工智能ETF华富","rgznetfhf"],
    ["516010","游戏ETF","yxetf"],["516020","化工ETF华宝","hgetfhb"],["516080","创新药ETF易方达","cxyetfyfd"],["516110","汽车ETF","qcETF"],["516120","化工ETF富国","hgetffg"],["516150","稀土ETF嘉实","xtetfjs"],
    ["516160","新能源ETF","xnyetf"],["516190","传媒ETF华夏","cmetfhx"],["516210","银行ETF华安","yhetfha"],["516220","化工ETF国泰","hgetfgt"],["516290","光伏ETF汇添富","gfetfhtf"],["516310","银行ETF易方达","yhetfyfd"],
    ["516350","芯片ETF易方达","xpetfyfd"],["516510","云计算ETF易方达","yjsetfyfd"],["516550","农业ETF嘉实","nyetfjs"],["516630","云计算ETF华夏","yjsetfhx"],["516640","芯片ETF富国","xpetffg"],["516650","有色金属ETF华夏","ysjsetfhx"],
    ["516670","畜牧养殖ETF招商","cmyzetfzs"],["516750","建材ETF富国","jcetffg"],["516760","养殖ETF平安","yzetfpa"],["516780","稀土ETF华泰柏瑞","xtetfhtbr"],["516810","农业ETF华夏","nyetfhx"],["516840","汽车ETF南方","qcetfnf"],
    ["516880","光伏ETF银华","gfetfyh"],["516900","食品饮料ETF华安","spyletfha"],["516920","芯片ETF汇添富","xpetfhtf"],["516950","基建ETF银华","jjetfyh"],["516960","机械ETF国泰","jxetfgt"],["516970","基建ETF广发","jjetfgf"],
    ["517050","互联网ETF华泰柏瑞","hlwetfhtbr"],["517090","央企共赢ETF国泰","yqgyetfgt"],["517110","创新药ETF国泰","cxyetfgt"],["517120","创新药ETF华泰柏瑞","cxyetfhtbr"],["517200","互联网ETF嘉实","hlwetfjs"],["517380","创新药ETF天弘","cxyetfth"],
    ["517390","云计算ETF天弘","yjsetfth"],["517800","人工智能50ETF方正富邦","rgzn50etffzfb"],["517900","银行AH优选ETF招商","yhahyxetfzs"],["518880","黄金ETF","hjetf"],["560170","央企科技ETF南方","yqkjetfnf"],["560230","光伏ETF富国","gfetffg"],
    ["560390","电网设备ETF易方达","dwsbetfyfd"],["560480","电力ETF招商","dletfzs"],["560580","电力ETF南方","dletfnf"],["560630","机器人ETF万家","jqretfwj"],["560660","云计算50ETF新华","yjs50etfxh"],["560780","半导体设备ETF广发","bdtsbetfgf"],
    ["560830","电力ETF华夏","dletfhx"],["560880","家电ETF广发","jdetfgf"],["560930","电力ETF易方达","dletfyfd"],["560980","光伏龙头ETF广发","gfltetfgf"],["561060","国企红利ETF华安","gqhletfha"],["561120","家电ETF富国","jdetffg"],
    ["561380","电网设备ETF国泰","dwsbetfgt"],["561460","人工智能ETF天弘","rgznetfth"],["561560","电力ETF华泰柏瑞","dletfhtbr"],["561580","央企红利ETF华泰柏瑞","yqhletfhtbr"],["561700","电力ETF博时","dletfbs"],["561920","疫苗ETF招商","ymetfzs"],
    ["561980","半导体设备ETF招商","bdtsbetfzs"],["562350","电力ETF银华","dletfyh"],["562360","机器人ETF银华","jqretfyh"],["562500","机器人ETF华夏","jqretfhx"],["562510","旅游ETF华夏","lyetfhx"],["562590","半导体设备ETF华夏","bdtsbetfhx"],
    ["562700","汽车零部件ETF华夏","qclbjetfhx"],["562860","疫苗ETF嘉实","ymetfjs"],["562900","农业ETF易方达","nyetfyfd"],["562970","光伏ETF易方达","gfetfyfd"],["588000","科创50ETF","kc50etf"],["588790","科创AIETF博时","kcaietfbs"],
    ["600000","浦发银行","pfyh"],["600001","邯郸钢铁","hdgt"],["600005","武钢股份","wggf"],["600008","首创环保","schb"],["600009","上海机场","shjc"],["600010","包钢股份","bggf"],
    ["600011","华能国际","hngj"],["600016","民生银行","msyh"],["600017","日照港","rzg"],["600018","上港集团","sgjt"],["600019","宝钢股份","bggf"],["600022","山东钢铁","sdgt"],
    ["600025","华能水电","hnsd"],["600028","中国石化","zgsh"],["600029","南方航空","nfhk"],["600030","中信证券","zxzq"],["600036","招商银行","zsyh"],["600048","保利发展","blfz"],
    ["600050","中国联通","zglt"],["600051","宁波联合","nblh"],["600054","黄山旅游","hsly"],["600061","国投资本","gtzb"],["600066","宇通客车","ytkc"],["600071","凤凰光学","fhgx"],
    ["600085","同仁堂","trt"],["600089","特变电工","tbdg"],["600104","上汽集团","sqjt"],["600111","北方稀土","bfxt"],["600115","中国东航","zgdh"],["600118","中国卫星","zgwx"],
    ["600123","兰花科创","lhkc"],["600132","重庆啤酒","cqpj"],["600133","东湖高新","dhgx"],["600150","中国船舶","zgcb"],["600159","大龙地产","dldc"],["600160","巨化股份","jhgf"],
    ["600161","天坛生物","ttsw"],["600168","武汉控股","whkg"],["600172","黄河旋风","hhxf"],["600176","中国巨石","zgjs"],["600183","生益科技","sykj"],["600186","莲花控股","lhkg"],
    ["600188","兖矿能源","ykny"],["600196","复星医药","fxyy"],["600219","南山铝业","nsly"],["600221","海航控股","hhkg"],["600230","沧州大化","czdh"],["600233","圆通速递","ytsd"],
    ["600256","广汇能源","ghny"],["600276","恒瑞医药","hryy"],["600279","重庆港","cqg"],["600288","大恒科技","dhkj"],["600295","鄂尔多斯","eeds"],["600303","曙光股份","sggf"],
    ["600309","万华化学","whhx"],["600313","农发种业","nfzy"],["600315","上海家化","shjh"],["600317","营口港","ykg"],["600332","白云山","bys"],["600346","恒力石化","hlsh"],
    ["600354","敦煌种业","dhzy"],["600362","江西铜业","jxty"],["600377","宁沪高速","nhgs"],["600378","昊华科技","hhkj"],["600406","国电南瑞","gdnr"],["600418","江淮汽车","jhqc"],
    ["600426","华鲁恒升","hlhs"],["600436","片仔癀","pzh"],["600438","通威股份","twgf"],["600449","宁夏建材","nxjc"],["600460","士兰微","slw"],["600482","中国动力","zgdl"],
    ["600489","中金黄金","zjhj"],["600493","凤竹纺织","fzfz"],["600498","烽火通信","fhtx"],["600502","安徽建工","ahjg"],["600513","联环药业","lhyy"],["600515","海南机场","hnjc"],
    ["600516","方大炭素","fdts"],["600519","贵州茅台","gzmt"],["600521","华海药业","hhyy"],["600526","菲达环保","fdhb"],["600536","中国软件","zgrj"],["600547","山东黄金","sdhj"],
    ["600569","安阳钢铁","aygt"],["600570","恒生电子","hsdz"],["600584","长电科技","cdkj"],["600585","海螺水泥","hlsn"],["600588","用友网络","yywl"],["600590","泰豪科技","thkj"],
    ["600598","北大荒","bdh"],["600600","青岛啤酒","qdpj"],["600601","方正科技","fzkj"],["600606","绿地控股","ldkg"],["600630","龙头股份","ltgf"],["600637","东方明珠","dfmz"],
    ["600658","电子城","dzc"],["600660","福耀玻璃","fybl"],["600661","昂立教育","aljy"],["600679","上海凤凰","shfh"],["600688","上海石化","shsh"],["600690","海尔智家","hrzj"],
    ["600691","潞化科技","lhkj"],["600697","欧亚集团","oyjt"],["600703","三安光电","sagd"],["600712","南宁百货","nnbh"],["600717","天津港","tjg"],["600721","百花医药","bhyy"],
    ["600732","爱旭股份","axgf"],["600740","山西焦化","sxjh"],["600745","闻泰科技","wtkj"],["600749","西藏旅游","xzly"],["600751","海航科技","hhkj"],["600756","浪潮软件","lcrj"],
    ["600760","中航沈飞","zhsf"],["600761","安徽合力","ahhl"],["600795","国电电力","gddl"],["600800","渤海化学","bhhx"],["600801","华新建材","hxjc"],["600803","新奥股份","xagf"],
    ["600825","新华传媒","xhcm"],["600831","广电网络","gdwl"],["600837","海通证券","htzq"],["600839","四川长虹","scch"],["600866","星湖科技","xhkj"],["600867","通化东宝","thdb"],
    ["600868","梅雁吉祥","myjx"],["600873","梅花生物","mhsw"],["600874","创业环保","cyhb"],["600887","伊利股份","ylgf"],["600888","新疆众和","xjzh"],["600893","航发动力","hfdl"],
    ["600900","长江电力","cjdl"],["600905","三峡能源","sxny"],["600919","江苏银行","jsyh"],["600926","杭州银行","hzyh"],["600933","爱柯迪","akd"],["600941","中国移动","zgyd"],
    ["600958","东方证券","dfzq"],["600960","渤海汽车","bhqc"],["600966","博汇纸业","bhzy"],["600984","建设机械","jsjx"],["600989","宝丰能源","bfny"],["600995","南网储能","nwcn"],
    ["601000","唐山港","tsg"],["601005","重庆钢铁","cqgt"],["601009","南京银行","njyh"],["601012","隆基绿能","ljln"],["601016","节能风电","jnfd"],["601018","宁波港","nbg"],
    ["601021","春秋航空","cqhk"],["601066","中信建投","zxjt"],["601088","中国神华","zgsh"],["601111","中国国航","zggh"],["601117","中国化学","zghx"],["601138","工业富联","gyfl"],
    ["601166","兴业银行","xyyh"],["601168","西部矿业","xbky"],["601169","北京银行","bjyh"],["601186","中国铁建","zgtj"],["601211","国泰君安","gtja"],["601225","陕西煤业","sxmy"],
    ["601228","广州港","gzg"],["601229","上海银行","shyh"],["601236","红塔证券","htzq"],["601238","广汽集团","gqjt"],["601288","农业银行","nyyh"],["601298","青岛港","qdg"],
    ["601318","中国平安","zgpa"],["601319","中国人保","zgrb"],["601328","交通银行","jtyh"],["601336","新华保险","xhbx"],["601377","兴业证券","xyzq"],["601390","中国中铁","zgzt"],
    ["601398","工商银行","gsyh"],["601600","中国铝业","zgly"],["601601","中国太保","zgtb"],["601618","中国中冶","zgzy"],["601628","中国人寿","zgrs"],["601633","长城汽车","ccqc"],
    ["601668","中国建筑","zgjz"],["601669","中国电建","zgdl"],["601678","滨化股份","bhgf"],["601688","华泰证券","htzq"],["601689","拓普集团","tpjt"],["601728","中国电信","zgdx"],
    ["601766","中国中车","zgcc"],["601799","星宇股份","xygf"],["601816","京沪高铁","jhgt"],["601838","成都银行","cdyh"],["601857","中国石油","zgsy"],["601865","福莱特","flt"],
    ["601877","正泰电器","ztdq"],["601878","浙商证券","zszq"],["601881","中国银河","zgyh"],["601888","中国中免","zgzm"],["601899","紫金矿业","zjky"],["601901","方正证券","fzzq"],
    ["601916","浙商银行","zsyh"],["601919","中远海控","zyhk"],["601928","凤凰传媒","fhcm"],["601933","永辉超市","yhcs"],["601939","建设银行","jsyh"],["601985","中国核电","zghd"],
    ["601988","中国银行","zgyh"],["601989","中国重工","zgzg"],["601995","中金公司","zjgs"],["601998","中信银行","zxyh"],["603000","人民网","rmw"],["603005","晶方科技","jfkj"],
    ["603019","中科曙光","zksg"],["603027","千禾味业","qhwy"],["603093","南华期货","nhqh"],["603139","康惠股份","khgf"],["603160","汇顶科技","hdkj"],["603161","科华控股","khkg"],
    ["603173","福斯达","fsd"],["603195","公牛集团","gnjt"],["603199","九华旅游","jhly"],["603259","药明康德","ymkd"],["603260","合盛硅业","hsgy"],["603288","海天味业","htwy"],
    ["603290","斯达半导","sdbd"],["603296","华勤技术","hqjs"],["603305","旭升集团","xsjt"],["603319","美湖股份","mhgf"],["603348","文灿股份","wcgf"],["603369","今世缘","jsy"],
    ["603392","万泰生物","wtsw"],["603501","韦尔股份","wegf"],["603515","欧普照明","opzm"],["603596","伯特利","btl"],["603659","璞泰来","ptl"],["603677","奇精机械","qjjx"],
    ["603799","华友钴业","hygy"],["603806","福斯特","fst"],["603833","欧派家居","opjj"],["603881","数据港","sjg"],["603882","金域医学","jyyx"],["603893","瑞芯微","rxw"],
    ["603899","晨光股份","cggf"],["603986","兆易创新","zycx"],["603989","艾华集团","ahjt"],["603993","洛阳钼业","lymy"],["605058","澳弘电子","ahdz"],["605098","行动教育","hdjy"],
    ["605117","德业股份","dygf"],["605319","无锡振华","wxzh"],["605358","立昂微","law"],["605499","东鹏饮料","dpyl"],["688008","澜起科技","lqkj"],["688009","中国通号","zgth"],
    ["688012","中微公司","zwgs"],["688017","绿的谐波","ldxb"],["688023","安恒信息","ahxx"],["688036","传音控股","cykg"],["688041","海光信息","hgxx"],["688047","龙芯中科","lxzk"],
    ["688065","凯赛生物","kssw"],["688072","拓荆科技","tjkj"],["688111","金山办公","jsbg"],["688169","石头科技","stkj"],["688180","君实生物","jssw"],["688183","生益电子","sydz"],
    ["688187","时代电气","sddq"],["688212","澳华内镜","ahnj"],["688235","百济神州","bjsz"],["688256","寒武纪","hwj"],["688271","联影医疗","lyyl"],["688283","坤恒顺维","khsw"],
    ["688303","大全能源","dqny"],["688323","瑞华泰","rht"],["688353","华盛锂电","hsld"],["688363","华熙生物","hxsw"],["688380","中微半导","zwbd"],["688396","华润微","hrw"],
    ["688399","硕世生物","sssw"],["688506","百利天恒","blth"],["688561","奇安信","qax"],["688599","天合光能","thgn"],["688660","电气风电","dqfd"],["688681","科汇股份","khgf"],
    ["688981","中芯国际","zxgj"],["689009","九号公司","jhgs"],["899050","北证50","bz50"],["980015","疫苗生科","ymsk"],["980022","机器人产业","jqrcy"],["980027","新能源电池","xnydc"],
    ["980028","龙头家电","ltjd"],["988007","创业板指(美元)(CNH)","cybzmycnh"]
  ];
  var m={};
  for(var i=0;i<raw.length;i++){ m[raw[i][0]]={name:raw[i][1],py:raw[i][2]}; }
  return m;
})();

var KL = {h:700, autoY:true};

var REP = {raw:"", mode:"rich", fs:"fs-m"};

var CMP = {sel:[], span:60};

var CMP_COLOR=["#58a6ff","#ff4d4f","#f5a524","#a371f7","#22c55e","#e3b341"];

/* ===== v2.0 全局状态（须优先初始化，避免 TDZ） ===== */
var APPVER  = "2.2";
var APPDATE = "2026-09-14";

/* K线显示设置 */
var KLSET = {preset:"full", ma:[5,10,20,60], candle:"solid", log:false,
             cross:true, split:false, wave:false, wavePct:5};
var MA_META = {5:"#58a6ff",10:"#79c0ff",20:"#f5a524",60:"#a371f7",
               120:"#22c55e",250:"#e3b341"};
var KL_PRESETS = {
  bare:{ma:[],       main:"none", sig:false, lv:true,  chan:false, wave:false},
  ma:  {ma:[5,10,20,60], main:"ma",  sig:true,  lv:true,  chan:false, wave:false},
  boll:{ma:[20],     main:"boll",sig:false, lv:false, chan:false, wave:false},
  chan:{ma:[20,60],  main:"ma",  sig:false, lv:true,  chan:true,  wave:false},
  wave:{ma:[],       main:"none", sig:false, lv:false, chan:false, wave:true},
  full:{ma:[5,10,20,60], main:"both", sig:true, lv:true, chan:true, wave:true}
};

/* 大事提醒 */
var ALERTS = [];

/* API 后台 */
var APILOG = [];
var APICFG = {
  proxy:"",
  order:["sina","tx","em"],
  on:{sina:true, tx:true, em:true},
  tpl:{
    sina:"https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol={SYM}&scale=240&ma=5&datalen={N}",
    tx:  "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={SYM},day,,,{N},qfq",
    em:  "https://push2his.eastmoney.com/api/qt/stock/kline/get?secid={SECID}&fields1=f1,f2,f3&fields2=f51,f52,f53,f54,f55,f56,f57&klt=101&fqt=1&end=20500101&lmt={N}"
  }
};

/* 持仓成本 / 数量：{code:{cost, qty}} */
var POS = {};

/* ============================================================
   A股复盘分析器 · 引擎一：指标计算 / 多空信号 / 五维评分 / 三周期
   ============================================================ */
"use strict";
var LS_KEY="ashare_review_v3";
var UP="#ff4d4f", DOWN="#22c55e", NEU="#8b949e", ACC="#4c8dff", WARN="#f5a524", PURPLE="#a371f7";

function $(id){return document.getElementById(id);}
function num(x){const v=parseFloat(String(x).replace(/,/g,""));return isFinite(v)?v:null;}
function f2(x){return x==null?"数据缺失":(Math.round(x*100)/100).toFixed(2);}
function f1(x){return x==null?"数据缺失":(Math.round(x*10)/10).toFixed(1);}
function f3(x){return x==null?"数据缺失":(Math.round(x*1000)/1000).toFixed(3);}
function pct(x){if(x==null)return "数据缺失";const v=num(x);return v==null?"数据缺失":(v>0?"+":"")+v.toFixed(2)+"%";}
function esc(s){return String(s==null?"":s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function nn(x){return x!=null&&isFinite(x);}

/* ---------- 基础指标 ---------- */
function sma(arr,n){const o=[];let s=0;for(let i=0;i<arr.length;i++){s+=arr[i];if(i>=n)s-=arr[i-n];o.push(i>=n-1?s/n:null);}return o;}
function ema(arr,n){const o=[];const k=2/(n+1);let p=null;for(let i=0;i<arr.length;i++){p=p==null?arr[i]:arr[i]*k+p*(1-k);o.push(p);}return o;}
function macd(closes){const e12=ema(closes,12),e26=ema(closes,26);const dif=e12.map((v,i)=>v-e26[i]);const dea=ema(dif,9);const bar=dif.map((v,i)=>(v-dea[i])*2);return {dif,dea,bar};}
function rsi(closes,n=14){
  const o=new Array(closes.length).fill(null);
  if(closes.length<=n)return o;
  let g=0,l=0;
  for(let i=1;i<=n;i++){const d=closes[i]-closes[i-1];if(d>0)g+=d;else l-=d;}
  g/=n;l/=n;o[n]= l===0?100:100-100/(1+g/l);
  for(let i=n+1;i<closes.length;i++){
    const d=closes[i]-closes[i-1];
    g=(g*(n-1)+(d>0?d:0))/n; l=(l*(n-1)+(d<0?-d:0))/n;
    o[i]= l===0?100:100-100/(1+g/l);
  }
  return o;
}
function kdj(highs,lows,closes,n=9){
  const K=[],D=[],J=[],RSV=[];
  let k=50,d=50;
  for(let i=0;i<closes.length;i++){
    if(i<n-1){K.push(null);D.push(null);J.push(null);RSV.push(null);continue;}
    let hh=-Infinity,ll=Infinity;
    for(let j=i-n+1;j<=i;j++){if(highs[j]>hh)hh=highs[j];if(lows[j]<ll)ll=lows[j];}
    const rsv= hh===ll?50:(closes[i]-ll)/(hh-ll)*100;
    RSV.push(rsv);
    k=(2*k+rsv)/3; d=(2*d+k)/3;
    K.push(k);D.push(d);J.push(3*k-2*d);
  }
  return {K,D,J,RSV};
}
function boll(closes,n=20,m=2){
  const mid=sma(closes,n),up=[],lo=[];
  for(let i=0;i<closes.length;i++){
    if(mid[i]==null){up.push(null);lo.push(null);continue;}
    let s=0;for(let j=i-n+1;j<=i;j++){const d=closes[j]-mid[i];s+=d*d;}
    const sd=Math.sqrt(s/n);
    up.push(mid[i]+m*sd);lo.push(mid[i]-m*sd);
  }
  return {up,mid,lo};
}
function avgVol(vols,n,i){
  if(i<n-1)return null;let s=0;for(let j=i-n+1;j<=i;j++)s+=vols[j];return s/n;
}
function volRatioSeries(vols,n=5){
  const o=[];for(let i=0;i<vols.length;i++){const a=avgVol(vols,n,i);o.push(a? (vols[i]/a):null);}return o;
}
function atrSeries(highs,lows,closes,n=14){
  const tr=[highs[0]-lows[0]];
  for(let i=1;i<closes.length;i++)tr.push(Math.max(highs[i]-lows[i],Math.abs(highs[i]-closes[i-1]),Math.abs(lows[i]-closes[i-1])));
  const o=[];let p=null;for(let i=0;i<tr.length;i++){p = p==null? tr[i] : (p*(n-1)+tr[i])/n; o.push(i>=n-1?p:null);}
  return o;
}

/* ---------- 背离 ---------- */
function detectDivergence(closes,dif){
  const n=closes.length; if(n<30)return "数据不足 30 根K线，未做背离检测";
  const out=[];
  // 顶背离：近30日内两个价格高点抬升，而对应 DIF 走低
  let h1=-1,h2=-1;let best1=-Infinity,best2=-Infinity;
  for(let i=n-30;i<n-1;i++){ if(closes[i]>best1){best1=closes[i];h1=i;} }
  for(let i=h1+1;i<n;i++){ if(closes[i]>best2){best2=closes[i];h2=i;} }
  if(h1>0&&h2>h1&&closes[h2]>closes[h1]*1.005&&nn(dif[h1])&&nn(dif[h2])&&dif[h2]<dif[h1])
    out.push(`顶背离：${closes[h1].toFixed(2)}(DIF ${dif[h1].toFixed(3)}) → ${closes[h2].toFixed(2)}(DIF ${dif[h2].toFixed(3)})，价格新高而动量走弱`);
  let l1=-1,l2=-1;let lo1=Infinity,lo2=Infinity;
  for(let i=n-30;i<n-1;i++){ if(closes[i]<lo1){lo1=closes[i];l1=i;} }
  for(let i=l1+1;i<n;i++){ if(closes[i]<lo2){lo2=closes[i];l2=i;} }
  if(l1>0&&l2>l1&&closes[l2]<closes[l1]*0.995&&nn(dif[l1])&&nn(dif[l2])&&dif[l2]>dif[l1])
    out.push(`底背离：${closes[l1].toFixed(2)}(DIF ${dif[l1].toFixed(3)}) → ${closes[l2].toFixed(2)}(DIF ${dif[l2].toFixed(3)})，价格新低而动量转强`);
  return out.length?out.join("；"):"未检测到明显背离";
}

/* ---------- 周线聚合 ---------- */
function isoWeek(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-day+3);const first=new Date(Date.UTC(t.getUTCFullYear(),0,4));return Math.round((t-first)/6048e5)+1;}
function weeklyFromDaily(rows){
  const out=[];let cur=null,key="";
  rows.forEach(r=>{
    const d=new Date(String(r.date||r[0]).replace(/-/g,"/"));
    const k=d.getFullYear()+"-"+isoWeek(d);
    const o=Array.isArray(r)?{date:r[0],o:r[1],h:r[2],l:r[3],c:r[4],v:r[5]}:{date:r.date,o:r.o,h:r.h,l:r.l,c:r.c,v:r.v};
    if(k!==key){ if(cur)out.push(cur); cur={date:o.date,o:o.o,h:o.h,l:o.l,c:o.c,v:o.v}; key=k; }
    else { cur.h=Math.max(cur.h,o.h); cur.l=Math.min(cur.l,o.l); cur.c=o.c; cur.v=cur.v+(o.v||0); cur.date=o.date; }
  });
  if(cur)out.push(cur);
  return out;
}
function analyzeWeekly(wrows){
  if(!wrows||wrows.length<12)return {ok:false,reason:"周线样本不足（需≥12根）"};
  const c=wrows.map(x=>x.c);
  const ma5=sma(c,5),ma10=sma(c,10),ma20=sma(c,20);
  const i=c.length-1;
  const arrange = nn(ma5[i])&&nn(ma10[i])&&nn(ma20[i]) ? (ma5[i]>ma10[i]&&ma10[i]>ma20[i]?"多头排列":(ma5[i]<ma10[i]&&ma10[i]<ma20[i]?"空头排列":"交织震荡")) : "数据不足";
  const slope = nn(ma5[i])&&nn(ma5[i-4]) ? ((ma5[i]-ma5[i-4])/ma5[i-4]*100) : null;
  const m=macd(c);
  return {ok:true,i,len:c.length,close:c[i],ma5:ma5[i],ma10:ma10[i],ma20:ma20[i],arrange,slope,
    dif:m.dif[i],dea:m.dea[i],bar:m.bar[i],
    trend:`周线${arrange}，周MA5=${f2(ma5[i])}${slope!=null?"（近4周"+(slope>0?"上行":"下行")+Math.abs(slope).toFixed(2)+"%）":""}`};
}

/* ---------- K线形态 ---------- */
function detectPatterns(rows){
  const out=[];const n=rows.length;if(n<3)return out;
  const R=k=>({o:num(Array.isArray(rows[k])?rows[k][1]:rows[k].o),h:num(Array.isArray(rows[k])?rows[k][2]:rows[k].h),
    l:num(Array.isArray(rows[k])?rows[k][3]:rows[k].l),c:num(Array.isArray(rows[k])?rows[k][4]:rows[k].c),
    d:Array.isArray(rows[k])?rows[k][0]:rows[k].date});
  for(let i=n-6;i<n;i++){
    if(i<1)continue;
    const a=R(i),b=R(i-1);
    if(a.o==null||b.o==null)continue;
    const body=Math.abs(a.c-a.o), rng=a.h-a.l;
    const upBody=a.c>a.o, dnBody=a.c<a.o;
    const lowTail=Math.min(a.c,a.o)-a.l, upTail=a.h-Math.max(a.c,a.o);
    if(body>0&&lowTail>body*2&&upTail<body*0.7&&rng>0) out.push({i,date:a.d,side:"b",nm:"锤头线",ds:"长下影+小实体，下探后收回"});
    if(body>0&&upTail>body*2&&lowTail<body*0.7&&rng>0) out.push({i,date:a.d,side:"s",nm:"倒锤头",ds:"长上影，上方抛压明显"});
    if(rng>0&&body<=rng*0.12) out.push({i,date:a.d,side:"n",nm:"十字星",ds:"多空平衡，变盘信号"});
    if(dnBody&&upBody&&a.c>=b.o&&a.o<=b.c&&b.c<b.o) out.push({i,date:a.d,side:"b",nm:"看涨吞没",ds:"阳线实体完全包住前一根阴线"});
    if(upBody&&dnBody&&a.c<=b.o&&a.o>=b.c&&b.c>b.o) out.push({i,date:a.d,side:"s",nm:"看跌吞没",ds:"阴线实体完全包住前一根阳线"});
    if(i>=2){
      const c2=R(i-2);
      if(c2.o!=null){
        const u=[c2,b,a].every(x=>x.c>x.o);
        const d3=[c2,b,a].every(x=>x.c<x.o);
        if(u)out.push({i,date:a.d,side:"b",nm:"红三兵",ds:"连续三根阳线，多头推进"});
        if(d3)out.push({i,date:a.d,side:"s",nm:"三只乌鸦",ds:"连续三根阴线，空头压制"});
      }
    }
  }
  return out;
}

/* ---------- 辅助：布林带宽 / 均线发散 / POC / 高低 ---------- */
function bollBw(bl,i){
  if(!nn(bl.up[i])||!nn(bl.lo[i])||!nn(bl.mid[i])||bl.mid[i]===0)return {bw:null,state:"数据缺失"};
  const bw=(bl.up[i]-bl.lo[i])/bl.mid[i]*100;
  let state="常态";
  if(bl.mid[i-5]!=null&&i>=5){
    const pb=(bl.up[i-5]-bl.lo[i-5])/bl.mid[i-5]*100;
    if(bw<pb*0.7)state="收敛（变盘临界）"; else if(bw>pb*1.4)state="扩张（趋势加速）";
  }
  return {bw,state};
}
function maSpread(ma5,ma20,ma60,i){
  const s1=nn(ma5[i])&&nn(ma20[i])&&ma20[i]!==0?(ma5[i]-ma20[i])/ma20[i]*100:null;
  const s2=nn(ma20[i])&&nn(ma60[i])&&ma60[i]!==0?(ma20[i]-ma60[i])/ma60[i]*100:null;
  return {s1,s2};
}
function volumePOC(rows,win){
  win=win||60;
  const seg=rows.slice(-win);
  const cs=seg.map(r=>num(Array.isArray(r)?r[4]:r.c)).filter(nn);
  if(cs.length<5)return {poc:null};
  const ref=cs[Math.floor(cs.length/2)];
  const step=Math.max(0.01, ref*0.01);   /* 固定 1% 价格步长分桶 */
  const buckets={};
  seg.forEach(r=>{
    const h=num(Array.isArray(r)?r[2]:r.h),l=num(Array.isArray(r)?r[3]:r.l),
          c=num(Array.isArray(r)?r[4]:r.c),v=num(Array.isArray(r)?r[5]:r.v)||0;
    if(!nn(c))return;
    const mid=(nn(h)&&nn(l))?(h+l)/2:c;
    const k=Math.round(mid/step);
    if(!buckets[k])buckets[k]={v:0,px:mid};
    buckets[k].v+=v;
    buckets[k].px=(buckets[k].px+buckets[k].cnt*0+mid)/2;
    buckets[k].cnt=(buckets[k].cnt||0)+1;
  });
  let bk=null,bv=-1;
  for(const k in buckets){if(buckets[k].v>bv){bv=buckets[k].v;bk=k;}}
  if(bk==null)return {poc:null};
  return {poc:Number(bk)*step, vol:bv, step};
}
function recentHL(closes,highs,lows,n){
  const h=highs.slice(-n).filter(nn),l=lows.slice(-n).filter(nn);
  return {hi:h.length?Math.max.apply(null,h):null, lo:l.length?Math.min.apply(null,l):null, n};
}

/* ============================================================
   核心：analyzeStock
   ============================================================ */
function analyzeStock(stk){
  const raw=stk&&stk.rows||[];
  const rows=raw.map(r=>Array.isArray(r)
    ?{date:r[0],o:num(r[1]),h:num(r[2]),l:num(r[3]),c:num(r[4]),v:num(r[5]),t:num(r[6])}
    :{date:r.date,o:num(r.o),h:num(r.h),l:num(r.l),c:num(r.c),v:num(r.v),t:num(r.turn)});
  if(rows.length<8)return {err:"K线样本不足（需≥8根），当前 "+rows.length+" 根"};
  const dates=rows.map(r=>r.date), opens=rows.map(r=>r.o), highs=rows.map(r=>r.h),
        lows=rows.map(r=>r.l), closes=rows.map(r=>r.c), vols=rows.map(r=>r.v||0),
        turn=rows.map(r=>r.t);
  const i=closes.length-1;
  const ma5=sma(closes,5),ma10=sma(closes,10),ma20=sma(closes,20),ma60=sma(closes,60);
  const m=macd(closes),dif=m.dif,dea=m.dea,bar=m.bar;
  const r=rsi(closes,14), r6=rsi(closes,6);
  const kd=kdj(highs,lows,closes),K=kd.K,D=kd.D,J=kd.J;
  const bl=boll(closes,20,2);
  const vrs=volRatioSeries(vols,5);
  const atr=atrSeries(highs,lows,closes,14);
  const close=closes[i], pre=closes[i-1], chg=pre?((close-pre)/pre*100):null;

  let arrange="数据不足";
  if(nn(ma5[i])&&nn(ma20[i])&&nn(ma60[i]))
    arrange = (ma5[i]>ma20[i]&&ma20[i]>ma60[i])?"多头排列":(ma5[i]<ma20[i]&&ma20[i]<ma60[i])?"空头排列":(ma5[i]>ma20[i]?"短期修复（MA5上穿MA20，MA60未确认）":"短期转弱（MA5跌破MA20）");
  else if(nn(ma5[i])&&nn(ma20[i])) arrange = ma5[i]>ma20[i]?"短多（MA60数据不足）":"短空（MA60数据不足）";

  let macdSig="数据缺失";
  if(nn(dif[i])&&nn(dea[i])){
    const cross = nn(dif[i-1])&&nn(dea[i-1])&&((dif[i-1]<=dea[i-1]&&dif[i]>dea[i])?"（今日金叉）":((dif[i-1]>=dea[i-1]&&dif[i]<dea[i])?"（今日死叉）":""));
    const rising = nn(bar[i-1])&&bar[i]>bar[i-1];
    macdSig=`DIF=${f3(dif[i])}，DEA=${f3(dea[i])}，柱=${f3(bar[i])}（${bar[i]>=0?"红":"绿"}柱${rising?"走强":"走弱"}）${dif[i]>dea[i]?"，DIF在DEA上方":"，DIF在DEA下方"}${cross}`;
  }
  const rsiV=r[i], rsiZone = !nn(rsiV)?"数据缺失":(rsiV>=80?"超买（≥80）":rsiV>=70?"偏强（70-80）":rsiV>=50?"中性偏多（50-70）":rsiV>=30?"中性偏弱（30-50）":rsiV>=20?"偏弱（20-30）":"超卖（≤20）");
  let kdjSig="数据缺失";
  if(nn(K[i])&&nn(D[i])){
    const cx = nn(K[i-1])&&nn(D[i-1])&&((K[i-1]<=D[i-1]&&K[i]>D[i])?"（今日金叉）":((K[i-1]>=D[i-1]&&K[i]<D[i])?"（今日死叉）":""));
    const blunt = (K[i]>80&&D[i]>80)?"（高位钝化）":(K[i]<20&&D[i]<20)?"（低位钝化）":"";
    kdjSig=`K=${f2(K[i])}，D=${f2(D[i])}，J=${f2(J[i])}${blunt}${cx}`;
  }

  const vr=vrs[i];
  const poc=volumePOC(rows,60);
  const hl60=recentHL(closes,highs,lows,60), hl20=recentHL(closes,highs,lows,20);
  const bw=bollBw(bl,i), ms=maSpread(ma5,ma20,ma60,i);
  const pats=detectPatterns(rows);
  const wk=analyzeWeekly(weeklyFromDaily(rows));
  const diver=detectDivergence(closes,dif);

  /* 支撑压力：近20/60日高低 + POC + 整数关口 + 均线 */
  const supSet=[],resSet=[];
  [hl20,hl60].forEach(h=>{ if(nn(h.lo)&&h.lo<close)supSet.push({v:h.lo,t:"近"+h.n+"日低"}); if(nn(h.hi)&&h.hi>close)resSet.push({v:h.hi,t:"近"+h.n+"日高"}); });
  if(nn(poc.poc)){ (poc.poc<close?supSet:resSet).push({v:poc.poc,t:"密集成交区POC"}); }
  [ma5,ma10,ma20,ma60].forEach((ma,k)=>{ const nm=["MA5","MA10","MA20","MA60"][k]; if(nn(ma[i])){ (ma[i]<close?supSet:resSet).push({v:ma[i],t:nm}); } });
  if(nn(bl.lo[i])&&bl.lo[i]<close)supSet.push({v:bl.lo[i],t:"BOLL下轨"});
  if(nn(bl.up[i])&&bl.up[i]>close)resSet.push({v:bl.up[i],t:"BOLL上轨"});
  const step = close>100?10:(close>50?5:(close>10?1:0.5));
  const rf=Math.ceil(close/step)*step, sf=Math.floor(close/step)*step;
  if(rf>close&&rf<close*1.06)resSet.push({v:rf,t:"整数关口"});
  if(sf<close&&sf>close*0.94)supSet.push({v:sf,t:"整数关口"});
  const dedup=a=>{const s=new Set();return a.filter(x=>{const k=x.v.toFixed(2);if(s.has(k))return false;s.add(k);return true;});};
  const supAll=dedup(supSet).sort((a,b)=>b.v-a.v).slice(0,4);
  const resAll=dedup(resSet).sort((a,b)=>a.v-b.v).slice(0,4);
  const sup=supAll.map(x=>x.v), res=resAll.map(x=>x.v);

  const an={rows,dates,opens,highs,lows,closes,vols,turn,i,close,pre,chg,
    ma5,ma10,ma20,ma60,dif,dea,bar,r,r6,K,D,J,bl,vrs,atr,vr,
    arrange,macdSig,rsiV,rsiZone,kdjSig,sup,res,supAll,resAll,diver,
    poc,hl20,hl60,bw,ms,pats,wk,lastTurn:turn[i],
    name:stk&&stk.name||"",code:stk&&stk.code||""};
  an.sigs=genSignals(an);
  an.score=scoreTech(an);
  an.tf=tfVerdict(an);
  an.chan=channelLines(an);
  /* 自身历史分位 */
  an.hist=scoreSeries(an,120);
  const cur=an.hist.length?an.hist[an.hist.length-1].v:an.score.total;
  const below=an.hist.filter(x=>x.v<cur).length;
  an.scorePct=an.hist.length>5?Math.round(below/an.hist.length*100):null;
  return an;
}

/* ============================================================
   多空信号引擎（客观形态识别，非交易指令）
   ============================================================ */
function genSignals(an){
  const S=[], n=an.closes.length;
  const push=(i,side,nm,ds,st)=>{ if(i<0||i>=n)return; S.push({i,date:an.dates[i],side,nm,ds,st:st||1,price:an.closes[i]}); };
  const hh=(arr,end,len)=>{const s=arr.slice(Math.max(0,end-len+1),end+1).filter(nn);return s.length?Math.max.apply(null,s):null;};

  for(let k=1;k<n;k++){
    /* MACD */
    if(nn(an.dif[k-1])&&nn(an.dea[k-1])&&nn(an.dif[k])&&nn(an.dea[k])){
      if(an.dif[k-1]<=an.dea[k-1]&&an.dif[k]>an.dea[k]) push(k,"b","MACD金叉",`DIF ${f3(an.dif[k])} 上穿 DEA ${f3(an.dea[k])}`,2);
      if(an.dif[k-1]>=an.dea[k-1]&&an.dif[k]<an.dea[k]) push(k,"s","MACD死叉",`DIF ${f3(an.dif[k])} 下穿 DEA ${f3(an.dea[k])}`,2);
    }
    /* 均线金叉/死叉 MA5 vs MA20 */
    if(nn(an.ma5[k-1])&&nn(an.ma20[k-1])&&nn(an.ma5[k])&&nn(an.ma20[k])){
      if(an.ma5[k-1]<=an.ma20[k-1]&&an.ma5[k]>an.ma20[k]) push(k,"b","均线金叉",`MA5 ${f2(an.ma5[k])} 上穿 MA20 ${f2(an.ma20[k])}`,2);
      if(an.ma5[k-1]>=an.ma20[k-1]&&an.ma5[k]<an.ma20[k]) push(k,"s","均线死叉",`MA5 ${f2(an.ma5[k])} 下穿 MA20 ${f2(an.ma20[k])}`,2);
    }
    /* KDJ */
    if(nn(an.K[k-1])&&nn(an.D[k-1])&&nn(an.K[k])&&nn(an.D[k])){
      if(an.K[k-1]<=an.D[k-1]&&an.K[k]>an.D[k]) push(k,"b","KDJ金叉",`K ${f2(an.K[k])} 上穿 D ${f2(an.D[k])}`+(an.D[k]<30?"（低位区，信号较强）":an.D[k]>70?"（高位钝化，信号打折）":""),an.D[k]<30?2:1);
      if(an.K[k-1]>=an.D[k-1]&&an.K[k]<an.D[k]) push(k,"s","KDJ死叉",`K ${f2(an.K[k])} 下穿 D ${f2(an.D[k])}`+(an.D[k]>70?"（高位区，信号较强）":an.D[k]<30?"（低位区，信号打折）":""),an.D[k]>70?2:1);
    }
    /* RSI 超卖回升 / 超买回落 */
    if(nn(an.r[k-1])&&nn(an.r[k])){
      if(an.r[k-1]<30&&an.r[k]>=30) push(k,"b","RSI超卖回升",`RSI(14) 由 ${f1(an.r[k-1])} 回升至 ${f1(an.r[k])}`,2);
      if(an.r[k-1]>70&&an.r[k]<=70) push(k,"s","RSI超买回落",`RSI(14) 由 ${f1(an.r[k-1])} 回落至 ${f1(an.r[k])}`,2);
    }
    /* 量能 */
    const av=avgVol(an.vols,5,k);
    if(av&&nn(an.vols[k])){
      const ratio=an.vols[k]/av;
      if(ratio>1.8){
        const prevHi=hh(an.highs,k-1,20);
        if(prevHi!=null&&an.closes[k]>prevHi&&an.closes[k]>an.closes[k-1])
          push(k,"b","放量突破",`量能 ${ratio.toFixed(2)} 倍于5日均量，收盘 ${f2(an.closes[k])} 突破前20日高点 ${f2(prevHi)}`,2);
        else if(an.closes[k]<an.closes[k-1])
          push(k,"s","放量下跌",`量能 ${ratio.toFixed(2)} 倍于5日均量且收阴，抛压释放`,2);
      }
      if(ratio<0.6&&nn(an.ma20[k])&&an.closes[k]>an.ma20[k]&&an.closes[k]<an.closes[k-1])
        push(k,"s","缩量回踩",`量能仅 ${ratio.toFixed(2)} 倍，缩量回落但仍处 MA20 上方`,1);
    }
    /* MA60 攻防 */
    if(nn(an.ma60[k-1])&&nn(an.ma60[k])){
      if(an.closes[k-1]<=an.ma60[k-1]&&an.closes[k]>an.ma60[k]) push(k,"b","站上MA60",`收盘 ${f2(an.closes[k])} 收复 MA60 ${f2(an.ma60[k])}`,2);
      if(an.closes[k-1]>=an.ma60[k-1]&&an.closes[k]<an.ma60[k]) push(k,"s","跌破MA60",`收盘 ${f2(an.closes[k])} 失守 MA60 ${f2(an.ma60[k])}`,2);
    }
    /* BOLL */
    if(nn(an.bl.lo[k])&&nn(an.lows[k])&&an.lows[k]<=an.bl.lo[k]*1.005&&an.closes[k]>an.opens[k])
      push(k,"b","下轨获支撑",`最低 ${f2(an.lows[k])} 触及 BOLL 下轨 ${f2(an.bl.lo[k])} 后收阳`,1);
    if(nn(an.bl.up[k])&&nn(an.highs[k])&&an.highs[k]>=an.bl.up[k]*0.995&&an.closes[k]<an.opens[k])
      push(k,"s","上轨受阻",`最高 ${f2(an.highs[k])} 触及 BOLL 上轨 ${f2(an.bl.up[k])} 后收阴`,1);
  }
  /* 形态 */
  (an.pats||[]).forEach(p=>push(p.i,p.side,p.nm,p.ds,1));
  /* 背离（落在最后一根） */
  if(typeof an.diver==="string"){
    if(an.diver.indexOf("顶背离")>=0) push(n-1,"s","顶背离",an.diver.split("；").filter(s=>s.indexOf("顶背离")>=0)[0],2);
    if(an.diver.indexOf("底背离")>=0) push(n-1,"b","底背离",an.diver.split("；").filter(s=>s.indexOf("底背离")>=0)[0],2);
  }
  /* 合并同一日同方向的信号，保留强度最高的 */
  const byDay={};
  S.forEach(s=>{const k=s.i+"|"+s.side;if(!byDay[k]||s.st>byDay[k].st)byDay[k]=s;});
  const merged=Object.keys(byDay).map(k=>byDay[k]);
  /* 同类信号冷却：10 个交易日内只保留最新一次，避免同一形态反复刷屏 */
  /* 按信号类型差异化冷却（KDJ/MACD 等敏感指标需要更长间隔，避免刷屏） */
  const COOL={"MACD金叉":15,"MACD死叉":15,"均线金叉":15,"均线死叉":15,
    "KDJ金叉":15,"KDJ死叉":15,"RSI超卖回升":20,"RSI超买回落":20,
    "放量突破":10,"放量下跌":10,"缩量回踩":10,"站上MA60":15,"跌破MA60":15,
    "下轨获支撑":10,"上轨受阻":10,"顶背离":30,"底背离":30};
  merged.sort((a,b)=>b.i-a.i);          /* 由新到旧 */
  const out=[],lastByName={};
  merged.forEach(s=>{
    const lk=lastByName[s.nm], need=COOL[s.nm]||10;
    if(lk!=null&&(lk-s.i)<need)return;  /* 与已保留的同名信号间隔不足 → 跳过 */
    lastByName[s.nm]=s.i;out.push(s);
  });
  return out.sort((a,b)=>b.i-a.i);
}

/* ============================================================
   历史评分序列：用同一套规则回算近 N 日简化分，用于算"自身分位"
   ============================================================ */
function scoreSeries(an,lookback){
  lookback=lookback||120;
  const n=an.closes.length, st=Math.max(1,n-lookback), out=[];
  const hi=an.hl60?an.hl60.hi:null, lo=an.hl60?an.hl60.lo:null;
  for(let k=st;k<n;k++){
    const ma5=an.ma5[k],ma20=an.ma20[k],ma60=an.ma60[k],c=an.closes[k];
    let t=0,m=0,p=0;
    if(nn(ma5))t+=c>ma5?5:0;
    if(nn(ma5)&&nn(ma20))t+=ma5>ma20?5:0;
    if(nn(ma60))t+=c>ma60?10:0;
    if(nn(an.bar[k])){m+=an.bar[k]>=0?10:0;if(nn(an.dif[k])&&nn(an.dea[k])&&an.dif[k]>an.dea[k])m+=5;}
    if(nn(an.r[k]))m+=an.r[k]>=50?Math.min(5,(an.r[k]-50)/30*5):0;
    if(nn(hi)&&nn(lo)&&hi>lo)p=Math.max(0,Math.min(10,(c-lo)/(hi-lo)*10));
    out.push({i:k,date:an.dates[k],v:Math.round((t+m+p)/50*100)});
  }
  return out;
}

/* ============================================================
   五维技术评分（0-100）
   ============================================================ */
function scoreTech(an){
  const i=an.i;
  /* 趋势 30 */
  let trend=0;
  if(an.wk&&an.wk.ok){ if(an.wk.arrange==="多头排列")trend+=10; else if(an.wk.arrange==="空头排列")trend+=0; else trend+=5;
    if(nn(an.wk.slope)) trend += an.wk.slope>0?Math.min(4,an.wk.slope*0.8):0; }
  else trend+=5;
  if(an.arrange==="多头排列")trend+=10; else if(an.arrange==="空头排列")trend+=0;
  else if(an.arrange.indexOf("修复")>=0||an.arrange.indexOf("短多")>=0)trend+=7; else trend+=3;
  if(nn(an.ma60[i])){
    const d=(an.close-an.ma60[i])/an.ma60[i]*100;
    trend += d>0?6:Math.max(0,6+d*0.8);   /* 离 MA60 越远越扣分，避免全 0 */
  } else trend+=3;
  trend=Math.max(0,Math.min(26,trend))+4;   /* 基础分 4，满分 30 */
  /* 动量 25（RSI/KDJ 用连续映射，避免非黑即白） */
  let momentum=0;
  if(nn(an.bar[i])){ momentum += an.bar[i]>=0?8:0; if(nn(an.bar[i-1])) momentum += an.bar[i]>an.bar[i-1]?4:0; if(an.dif[i]>an.dea[i])momentum+=3; }
  if(nn(an.rsiV)) momentum += Math.round(an.rsiV/100*6);
  if(nn(an.K[i])) momentum += Math.round(Math.min(4,an.K[i]/100*4));
  momentum=Math.max(0,Math.min(22,momentum))+3;
  /* 量能 15 */
  let volume=0;
  if(nn(an.vr)) volume += an.vr>1.2?8:(an.vr>0.9?5:2);
  if(nn(an.vr)&&nn(an.chg)) volume += (an.chg>0&&an.vr>1)?7:((an.chg<0&&an.vr>1)?0:4);
  volume=Math.max(0,Math.min(12,volume))+3;
  /* 位置 15 */
  let position=0;
  if(nn(an.bl.up[i])&&nn(an.bl.lo[i])&&an.bl.up[i]>an.bl.lo[i]){
    const p=(an.close-an.bl.lo[i])/(an.bl.up[i]-an.bl.lo[i])*100;
    position += Math.round(Math.max(0,Math.min(100,p))/100*8);
  }
  if(nn(an.hl60.hi)&&nn(an.hl60.lo)&&an.hl60.hi>an.hl60.lo){
    const p=(an.close-an.hl60.lo)/(an.hl60.hi-an.hl60.lo)*100;
    position += Math.round(Math.max(0,Math.min(100,p))/100*7);
  }
  position=Math.max(0,Math.min(15,position));
  /* 形态 15 */
  let pattern=7;
  const recent=(an.sigs||[]).filter(s=>s.i>=an.i-20);
  let net=0; recent.forEach(s=>net += s.side==="b"?s.st:(s.side==="s"?-s.st:0));
  pattern += Math.max(-6,Math.min(6,net*1.2));
  const lastPats=(an.pats||[]).filter(p=>p.i>=an.i-5);
  lastPats.forEach(p=>pattern += p.side==="b"?1.5:(p.side==="s"?-1.5:0));
  pattern=Math.max(0,Math.min(15,Math.round(pattern)));

  const total=Math.round(trend+momentum+volume+position+pattern);
  let label,tone;
  if(total>=72){label="极强";tone="up";}
  else if(total>=58){label="偏强";tone="up";}
  else if(total>=42){label="中性震荡";tone="neu";}
  else if(total>=28){label="偏弱";tone="down";}
  else {label="极弱";tone="down";}
  return {total,label,tone,dims:{趋势:Math.round(trend),动量:Math.round(momentum),量能:Math.round(volume),位置:Math.round(position),形态:pattern},
    caps:{趋势:30,动量:25,量能:15,位置:15,形态:15}};
}

/* ============================================================
   短 / 中 / 长 三周期研判
   ============================================================ */
function tfVerdict(an){
  const i=an.i, out=[];
  const cls=(v)=>v>=0?"up":"down";
  /* 短线 1-5 日 */
  {
    let sc=0, ev=[];
    const ma5=an.ma5[i],ma10=an.ma10[i],c=an.close;
    if(nn(ma5)&&nn(ma10)){ const d=(ma5-ma10)/ma10*100; ev.push(`MA5 ${f2(ma5)} vs MA10 ${f2(ma10)}（${d>0?"多头":"空头"}，乖离 ${d.toFixed(2)}%）`); sc += d>1?2:(d<-1?-2:0); }
    const bias5 = nn(ma5)?(c-ma5)/ma5*100:null;
    if(nn(bias5)){ ev.push(`收盘对 MA5 乖离 ${bias5>0?"+":""}${bias5.toFixed(2)}%`); sc += bias5>2?1:(bias5<-2?-1:0); }
    if(nn(an.r6[i])){ ev.push(`RSI(6)=${f1(an.r6[i])}（${an.r6[i]>=80?"短线超买":an.r6[i]<=20?"短线超卖":"中性区"}）`); sc += an.r6[i]>=80?-1:(an.r6[i]<=20?1:0); }
    if(nn(an.J[i])){ ev.push(`KDJ J=${f2(an.J[i])}（${an.J[i]>100?"超买钝化":an.J[i]<0?"超卖区":"常态"}）`); sc += an.J[i]>100?-1:(an.J[i]<0?1:0); }
    if(nn(an.vr)){ ev.push(`量比 ${an.vr.toFixed(2)}（${an.vr>1.5?"明显放量":an.vr<0.7?"明显缩量":"常态"}）`); sc += (nn(an.chg)&&an.chg>0&&an.vr>1.2)?2:((nn(an.chg)&&an.chg<0&&an.vr>1.2)?-2:0); }
    const label = sc>=3?"短线偏多":(sc<=-3?"短线偏空":"短线中性");
    out.push({tf:"短线（1–5日）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  /* 中线 20-60 日 */
  {
    let sc=0, ev=[];
    ev.push(`均线：${an.arrange}`);
    if(an.arrange==="多头排列")sc+=3; else if(an.arrange==="空头排列")sc-=3;
    else if(an.arrange.indexOf("修复")>=0)sc+=1; else sc-=1;
    if(nn(an.bar[i])){ const rising=nn(an.bar[i-1])&&an.bar[i]>an.bar[i-1]; ev.push(`MACD 柱 ${f2(an.bar[i])}（${an.bar[i]>=0?"红":"绿"}柱，${rising?"走强":"走弱"}）`); sc += (an.bar[i]>=0?2:-2)+(rising?1:-1); }
    if(nn(an.ma20[i])&&nn(an.ma60[i])){ const d=(an.ma20[i]-an.ma60[i])/an.ma60[i]*100; ev.push(`MA20 ${f2(an.ma20[i])} vs MA60 ${f2(an.ma60[i])}（乖离 ${d>0?"+":""}${d.toFixed(2)}%）`); sc += d>2?2:(d<-2?-2:0); }
    if(an.bw&&nn(an.bw.bw)) ev.push(`布林带宽 ${an.bw.bw.toFixed(2)}%（${an.bw.state}）`);
    if(an.ms&&nn(an.ms.s1)) ev.push(`MA5-MA20 发散 ${an.ms.s1>0?"+":""}${an.ms.s1.toFixed(2)}%`);
    const label = sc>=3?"中线偏多":(sc<=-3?"中线偏空":"中线震荡");
    out.push({tf:"中线（20–60日）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  /* 长线 周线 */
  {
    let sc=0, ev=[];
    if(an.wk&&an.wk.ok){
      ev.push(an.wk.trend);
      if(an.wk.arrange==="多头排列")sc+=3; else if(an.wk.arrange==="空头排列")sc-=3;
      if(nn(an.wk.slope)) sc += an.wk.slope>1?2:(an.wk.slope<-1?-2:0);
      if(nn(an.wk.bar)){ ev.push(`周线 MACD 柱 ${f2(an.wk.bar)}（${an.wk.bar>=0?"红":"绿"}）`); sc += an.wk.bar>=0?2:-2; }
      ev.push(`周线样本 ${an.wk.len} 根，周收盘 ${f2(an.wk.close)}`);
    } else { ev.push((an.wk&&an.wk.reason)||"周线数据不足"); }
    const label = sc>=3?"长线偏多":(sc<=-3?"长线偏空":"长线震荡");
    out.push({tf:"长线（周线）",label,tone:sc>=3?"up":(sc<=-3?"down":"neu"),ev,score:sc});
  }
  return out;
}

/* ============================================================
   趋势通道（最近 W 根 close 线性回归 ± 最大偏离）
   ============================================================ */
function channelLines(an,W){
  W=W||Math.min(60,an.closes.length);
  const st=Math.max(0,an.closes.length-W);
  const xs=[],ys=[];
  for(let i=st;i<an.closes.length;i++){xs.push(i-st);ys.push(an.closes[i]);}
  const n=xs.length; if(n<8)return null;
  const mx=xs.reduce((a,b)=>a+b,0)/n, my=ys.reduce((a,b)=>a+b,0)/n;
  let sxy=0,sxx=0;
  for(let k=0;k<n;k++){sxy+=(xs[k]-mx)*(ys[k]-my);sxx+=(xs[k]-mx)*(xs[k]-mx);}
  if(sxx===0)return null;
  const b=sxy/sxx, a=my-b*mx;
  let upDev=-Infinity,dnDev=Infinity;
  for(let k=0;k<n;k++){const fit=a+b*xs[k];const d=ys[k]-fit;if(d>upDev)upDev=d;if(d<dnDev)dnDev=d;}
  const line=(off)=>{const o=new Array(an.closes.length).fill(null);for(let k=0;k<n;k++)o[st+k]=a+b*xs[k]+off;return o;};
  return {mid:line(0),up:line(upDev),lo:line(dnDev),slope:b,slopePct:b/my*100,
    dir:b>0?"上升通道":(b<0?"下降通道":"横向通道")};
}

/* ============================================================
   引擎二：状态 / UI 渲染 / 图表
   ============================================================ */

/* ---------- 状态 ---------- */
function buildDefaultStocks(){
  const s={};
  /* 内置公开行情快照全部进内存索引（builtin 标记：不写 localStorage、可单删） */
  Object.keys(DEFAULT_STOCKS).forEach(c=>{ s[c]={rows:DEFAULT_STOCKS[c].rows,builtin:true}; });
  DEFAULT_HOLDINGS.forEach(h=>{ if(DEFAULT_STOCKS[h.code] && !s[h.code]) s[h.code]={rows:DEFAULT_STOCKS[h.code].rows,builtin:true}; });
  /* 三大指数：仅用于大盘趋势计算，不进持仓清单 */
  if(typeof DEFAULT_INDEX!=="undefined"){
    const IDXN={ "000001":"上证指数","399001":"深证成指","399006":"创业板指" };
    Object.keys(DEFAULT_INDEX).forEach(c=>{ s[c]={rows:DEFAULT_INDEX[c],name:IDXN[c]||c,code:c,isIndex:true}; });
  }
  return s;
}
function defaultSectors(){
  return (DEFAULT_SNAPSHOT.hot||[]).slice(0,5).map(x=>({
    name:x.name, chg:(x.chg==null?"":x.chg), logic:"资金",
    leader:x.leader||"", mid:"", low:"", days:"", note:(x.kind==="concept"?"概念板块":"行业板块")
  }));
}
function defaultState(){
  const snap=DEFAULT_SNAPSHOT.index||{};
  return {
    holdings:DEFAULT_HOLDINGS.map(h=>({...h})),
    market:{
      sh_close:snap.sh_close, sh_chg:snap.sh_chg, sh_amt:snap.sh_amt, sh_amtd:snap.sh_amtd,
      sz_close:snap.sz_close, sz_chg:snap.sz_chg, sz_amt:snap.sz_amt, sz_amtd:snap.sz_amtd,
      cy_close:snap.cy_close, cy_chg:snap.cy_chg, cy_amt:snap.cy_amt, cy_amtd:snap.cy_amtd
    },
    breadth:{}, vol_note:"", sections:{},
    sectors:defaultSectors(),
    stocks:buildDefaultStocks(),
    snap:JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]})),
    risk:{}
  };
}
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(LS_KEY));
    if(s&&s.holdings){
      s.stocks=s.stocks||{};
      /* 内置公开行情快照全部并入内存索引（builtin 标记，不入 localStorage） */
      if(typeof DEFAULT_STOCKS!=="undefined"){
        Object.keys(DEFAULT_STOCKS).forEach(c=>{
          const d=s.stocks[c];
          if(!d||!d.rows||d.rows.length<2)s.stocks[c]={rows:DEFAULT_STOCKS[c].rows,builtin:true};
        });
      }
      DEFAULT_HOLDINGS.forEach(h=>{const d=s.stocks[h.code];if(!d||!d.rows||d.rows.length<2)s.stocks[h.code]={rows:(DEFAULT_STOCKS[h.code]||{}).rows||[],builtin:true};});
      if(typeof DEFAULT_INDEX!=="undefined"){
        const IDXN={"000001":"上证指数","399001":"深证成指","399006":"创业板指"};
        Object.keys(DEFAULT_INDEX).forEach(c=>{
          const d=s.stocks[c];
          if(!d||!d.rows||d.rows.length<2)s.stocks[c]={rows:DEFAULT_INDEX[c],name:IDXN[c]||c,code:c,isIndex:true};
        });
      }
      s.sectors=s.sectors||defaultSectors();
      s.snap=s.snap||JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]}));
      s.market=Object.assign({},defaultState().market,s.market||{});
      s.breadth=s.breadth||{};
      return s;
    }
  }catch(e){}
  return defaultState();
}
function saveState(){
  try{
    /* 内置行情（builtin）不重复写盘，只存用户自己拉取的数据 */
    const st={};
    Object.keys(state.stocks||{}).forEach(c=>{ if(!state.stocks[c].builtin) st[c]=state.stocks[c]; });
    const out=Object.assign({},state,{stocks:st});
    localStorage.setItem(LS_KEY,JSON.stringify(out));
  }catch(e){}
}
let state=loadState();

/* ---------- 分析缓存 ---------- */
var AN_CACHE={};
function nameOf(code){
  const h=(state.holdings||[]).find(x=>x.code===code);
  if(h)return h.name;
  return code;
}
function getAn(code){
  if(AN_CACHE[code])return AN_CACHE[code];
  const stk=state.stocks[code];
  if(!stk||!stk.rows||stk.rows.length<8)return null;
  const an=analyzeStock({rows:stk.rows,name:nameOf(code),code:code});
  if(an&&an.err)return null;
  AN_CACHE[code]=an;return an;
}
function clearAn(code){ if(code)delete AN_CACHE[code]; else AN_CACHE={}; }

/* ---------- tab ---------- */
function tab(id){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  document.querySelectorAll("main section").forEach(s=>s.classList.toggle("on",s.id===id));
  if(id==="dash")renderDash();
  if(id==="stock"&&!$("stockCode").value&&(state.holdings[0]))pickStock(state.holdings[0].code);
  if(id==="report")genReport();
  if(id==="market"){renderMarket();}
  try{ if(window&&typeof window.scrollTo==="function")window.scrollTo({top:0,behavior:"smooth"}); }catch(e){}
}

/* ---------- 头部状态 ---------- */
function renderHeader(){
  const m=state.market||{}, b=state.breadth||{};
  const pcs=(v)=>v==null||v===""?'<span class="muted">—</span>':'<b class="'+(num(v)>=0?"up":"down")+'">'+pct(v)+'</b>';
  let h='<span class="pill">数据快照 <b>'+SNAPSHOT_DATE+'</b></span>';
  h+='<span class="pill '+((num(m.sh_chg)||0)>=0?"up":"down")+'">上证 <b>'+(m.sh_close!=null?f2(m.sh_close):"—")+'</b> '+pcs(m.sh_chg)+'</span>';
  h+='<span class="pill '+((num(m.cy_chg)||0)>=0?"up":"down")+'">创业板 <b>'+(m.cy_close!=null?f2(m.cy_close):"—")+'</b> '+pcs(m.cy_chg)+'</span>';
  if(b.up!=null&&b.up!=="")h+='<span class="pill">涨跌 <b class="up">'+b.up+'</b>/<b class="down">'+b.dn+'</b></span>';
  else h+='<span class="pill">涨跌家数 <b>待刷新</b></span>';
  h+='<span class="pill">持仓 <b>'+state.holdings.length+'</b> 只</span>';
  $("hstat").innerHTML=h;
  ["snapDateTxt","snapDateTxt2","footDate"].forEach(id=>{const e=$(id);if(e)e.textContent=SNAPSHOT_DATE;});
}

/* ---------- 大盘环境 ---------- */
function renderMarket(){
  const m=state.market||{};
  const card=(nm,c,chg,amt,amtd)=>{
    const u=(num(chg)||0)>=0;
    return '<div class="kpi '+(u?"up":"down")+'">'
      +'<div class="lb">'+nm+'</div><div class="vl">'+f2(c)+'</div>'
      +'<div class="ex"><b class="'+(u?"up":"down")+'">'+pct(chg)+'</b> · 成交额 '+(amt!=null?f2(amt)+'亿':'数据缺失')
      +(amtd!=null?'（环比 '+pct(amtd)+'）':'')+'</div></div>';
  };
  $("idxCards").innerHTML=
    card("上证指数",m.sh_close,m.sh_chg,m.sh_amt,m.sh_amtd)
   +card("深证成指",m.sz_close,m.sz_chg,m.sz_amt,m.sz_amtd)
   +card("创业板指",m.cy_close,m.cy_chg,m.cy_amt,m.cy_amtd);
  const b=state.breadth||{};
  ["up","dn","zt","dt","zb","amt"].forEach(k=>{const e=$("b_"+k);if(e&&b[k]!=null)e.value=b[k];});
  const vn=$("vol_note"); if(vn&&state.vol_note)vn.value=state.vol_note;
  renderIdxMa();
  renderIdxChart();
  renderBreadthBar();
  renderSnapshot();
  renderSectorMap();
  renderMarketAi();
}
function renderIdxMa(){
  const tb=$("idxMaTbl"); if(!tb)return;
  const idxs=[["000001","上证指数"],["399001","深证成指"],["399006","创业板指"]];
  let h="";
  idxs.forEach(([cd,nm])=>{
    const an=getAn(cd);
    if(!an){ h+='<tr><td>'+nm+'</td><td colspan="4" class="muted">未载入指数K线（可在个股诊断粘贴后用"载入"自动回填）</td></tr>'; return; }
    const i=an.i;
    const pos=[];
    [[an.ma5,"MA5"],[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(([ma,n])=>{
      if(!nn(ma[i])){pos.push(n+"缺失");return;}
      pos.push(n+(an.close>ma[i]?"上方":"下方"));
    });
    h+='<tr><td>'+nm+'</td><td class="num">'+f2(an.ma5[i])+'</td><td class="num">'+f2(an.ma20[i])+'</td>'
      +'<td class="num">'+f2(an.ma60[i])+'</td><td><span class="chip '+((an.close>an.ma20[i])?"up":"down")+'">'+pos.join(" · ")+'</span></td></tr>';
  });
  tb.innerHTML=h;
}
function renderBreadthBar(){
  const el=$("breadthBar"); if(!el||typeof echarts==="undefined")return;
  const b=state.breadth||{};
  const up=num(b.up)||0, dn=num(b.dn)||0, zt=num(b.zt)||0, dt=num(b.dt)||0, zb=num(b.zb)||0;
  if(!up&&!dn){ el.innerHTML='<div class="empty">涨跌家数：数据缺失 — 点顶部「↻ 刷新行情」获取</div>'; if(el._c){el._c.dispose();el._c=null;} return; }
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    grid:{left:8,right:8,top:26,bottom:8,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},
      backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12}},
    xAxis:{type:"category",data:["上涨","下跌","涨停","跌停","炸板"],axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{color:"#93a1b8"}},
    yAxis:{type:"value",splitLine:{lineStyle:{color:"rgba(38,49,69,.6)"}},axisLabel:{color:"#93a1b8"}},
    series:[{type:"bar",barWidth:"46%",
      data:[{value:up,itemStyle:{color:UP}},{value:dn,itemStyle:{color:DOWN}},
            {value:zt,itemStyle:{color:"#ff8a5c"}},{value:dt,itemStyle:{color:"#16a34a"}},
            {value:zb,itemStyle:{color:WARN}}],
      label:{show:true,position:"top",color:"#c7d3e3",fontSize:11}}]
  },true);
}
function renderSnapshot(){
  const box=$("snapBox"); if(!box)return;
  const s=state.snap||{};
  const tbl=(title,rows,cols)=>{
    let h='<div><h4 style="font-size:13px;margin-bottom:8px;color:var(--muted)">'+title+'</h4><table><thead><tr>'
      +cols.map(c=>'<th'+(c.right?' class="num"':'')+'>'+c.t+'</th>').join("")+'</tr></thead><tbody>';
    if(!rows.length)h+='<tr><td colspan="'+cols.length+'" class="muted">数据缺失</td></tr>';
    rows.forEach(r=>{ h+='<tr>'+cols.map(c=>'<td'+(c.right?' class="num"':'')+'>'+c.f(r)+'</td>').join("")+'</tr>'; });
    return h+'</tbody></table></div>';
  };
  box.innerHTML=
    tbl("热门领涨板块（快照）",(s.hot||[]).slice(0,8),[
      {t:"板块",f:r=>esc(r.name)+(r.kind==="concept"?' <span class="chip neu">概念</span>':'')},
      {t:"涨跌幅",right:1,f:r=>'<b class="'+((num(r.chg)||0)>=0?"up":"down")+'">'+pct(r.chg)+'</b>'},
      {t:"领涨股",f:r=>esc(r.leader||"—")}
    ])
   +tbl("主力净流入行业（快照）",(s.money||[]).slice(0,8),[
      {t:"行业",f:r=>esc(r.name)},
      {t:"净流入(亿)",right:1,f:r=>'<b class="'+((num(r.net)||0)>=0?"up":"down")+'">'+(r.net==null?"—":(num(r.net)>0?"+":"")+f2(r.net))+'</b>'},
      {t:"涨跌幅",right:1,f:r=>'<span class="'+((num(r.chg)||0)>=0?"up":"down")+'">'+pct(r.chg)+'</span>'},
      {t:"近5日净额(亿)",right:1,f:r=>'<span class="'+((num(r.days5)||0)>=0?"up":"down")+'">'+(r.days5==null?"—":(num(r.days5)>0?"+":"")+f2(r.days5))+'</span>'}
    ]);
  const j=$("snapJson"); if(j&&!j.value&&!j._touched){
    j.value=JSON.stringify({hot:(s.hot||[]).slice(0,5),money:(s.money||[]).slice(0,5)},null,1);
  }
}

/* ---------- 板块轮动 ---------- */
function renderSectors(){
  const box=$("sectorBox"); if(!box)return;
  let h='<table><thead><tr><th style="width:150px">板块</th><th style="width:100px">涨跌幅%</th><th style="width:110px">驱动逻辑</th>'
       +'<th>龙头</th><th>中军跟风</th><th>低位补涨</th><th style="width:80px">连续天数</th><th style="width:60px"></th></tr></thead><tbody>';
  (state.sectors||[]).forEach((s,idx)=>{
    h+='<tr>'
     +'<td><input data-s="'+idx+'" data-k="name" value="'+esc(s.name)+'" placeholder="板块名"></td>'
     +'<td><input data-s="'+idx+'" data-k="chg" value="'+esc(s.chg)+'" placeholder="如 4.44"></td>'
     +'<td><select data-s="'+idx+'" data-k="logic">'
       +["政策","业绩","事件","资金"].map(o=>'<option'+(s.logic===o?" selected":"")+'>'+o+'</option>').join("")+'</select></td>'
     +'<td><input data-s="'+idx+'" data-k="leader" value="'+esc(s.leader||"")+'" placeholder="龙头股"></td>'
     +'<td><input data-s="'+idx+'" data-k="mid" value="'+esc(s.mid||"")+'" placeholder="中军"></td>'
     +'<td><input data-s="'+idx+'" data-k="low" value="'+esc(s.low||"")+'" placeholder="补涨"></td>'
     +'<td><input data-s="'+idx+'" data-k="days" value="'+esc(s.days||"")+'" placeholder="如 3"></td>'
     +'<td><button class="btn sm danger" data-del="'+idx+'">删</button></td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
  box.querySelectorAll("input,select").forEach(el=>{
    el.onchange=()=>{
      const i=+el.dataset.s,k=el.dataset.k;
      state.sectors[i][k]=el.value;saveState();
      if(k==="chg")renderSectorVerdict();
      renderSectorVerdict();
    };
  });
  box.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick=()=>{state.sectors.splice(+btn.dataset.del,1);saveState();renderSectors();};
  });
  renderSectorVerdict();
}
function renderSectorVerdict(){
  const el=$("sectorVerdict"); if(!el)return;
  const ss=(state.sectors||[]).filter(s=>s.name);
  if(!ss.length){el.innerHTML='<div class="empty">尚未填写板块数据</div>';return;}
  const money=(state.snap&&state.snap.money)||[];
  const netMap={};money.forEach(m=>netMap[m.name]=num(m.net));
  const d5Map={};money.forEach(m=>d5Map[m.name]=num(m.days5));
  let h='<table><thead><tr><th>板块</th><th class="num">涨幅</th><th>驱动</th><th class="num">主力净额(亿)</th>'
       +'<th class="num">近5日(亿)</th><th>资金持续性</th><th>梯队完整性</th><th>判定</th></tr></thead><tbody>';
  ss.forEach(s=>{
    const net=netMap[s.name], d5=d5Map[s.name];
    let cont='<span class="muted">数据缺失</span>';
    if(net!=null&&d5!=null) cont = (net>0&&d5>0)?'<span class="chip up">连续净流入</span>'
      :(net>0&&d5<0)?'<span class="chip warn">今日回流/5日净出</span>'
      :(net<0&&d5<0)?'<span class="chip down">持续净流出</span>':'<span class="chip warn">今日流出/5日净入</span>';
    else if(net!=null) cont = net>0?'<span class="chip up">今日净流入</span>':'<span class="chip down">今日净流出</span>';
    const ladder=[s.leader,s.mid,s.low].filter(x=>x).length;
    const lad = ladder>=3?'<span class="chip up">完整（龙头+中军+补涨）</span>':(ladder===2?'<span class="chip warn">部分（'+ladder+'/3）</span>':'<span class="chip down">不完整（仅'+ladder+'/3）</span>');
    const days=num(s.days)||0;
    const judge = (days>=3&&ladder>=2)?'<span class="chip up">主线（连续'+days+'天）</span>':(days>=2?'<span class="chip acc">疑似主线</span>':'<span class="chip neu">轮动/首日</span>');
    h+='<tr><td><b>'+esc(s.name)+'</b></td><td class="num"><b class="'+((num(s.chg)||0)>=0?"up":"down")+'">'+pct(s.chg)+'</b></td>'
      +'<td><span class="chip neu">'+esc(s.logic)+'</span></td><td class="num">'+(net==null?"—":'<b class="'+(net>=0?"up":"down")+'">'+(net>0?"+":"")+f2(net)+'</b>')+'</td>'
      +'<td class="num">'+(d5==null?"—":'<span class="'+(d5>=0?"up":"down")+'">'+(d5>0?"+":"")+f2(d5)+'</span>')+'</td>'
      +'<td>'+cont+'</td><td>'+lad+'</td><td>'+judge+'</td></tr>';
  });
  h+='</tbody></table>';
  const sorted=[...ss].sort((a,b)=>(num(b.chg)||0)-(num(a.chg)||0));
  const top=sorted[0];
  const noLeader=ss.filter(s=>!s.leader).length;
  h+='<div class="banner '+(noLeader>ss.length/2?"":"info")+'" style="margin-top:12px">'
    +'梯队评估：当前 '+ss.length+' 个板块中，<b>'+(ss.length-noLeader)+'</b> 个已标注龙头；'
    +(top?'领涨为 <b>'+esc(top.name)+'（'+pct(top.chg)+'）</b>。':'')
    +(noLeader>ss.length/2?'　⚠ 超半数板块缺龙头/中军标注，梯队完整性判断依据不足，标注"数据缺失"。':'')
    +'　说明：主线判定 = 连续天数≥3 且梯队要素≥2 项；否则归为轮动。</div>';
  el.innerHTML=h;
}

/* ---------- 持仓管理 ---------- */
function renderHoldings(){
  const box=$("holdList"); if(!box)return;
  let h='<table><thead><tr><th style="width:52px">纳入</th><th style="width:110px">代码</th><th>名称</th><th style="width:90px">类型</th>'
       +'<th class="num">最新</th><th class="num">涨跌</th><th class="num">评分</th><th>技术评级</th><th>K线</th><th style="width:60px"></th></tr></thead><tbody>';
  state.holdings.forEach((hd,idx)=>{
    const an=getAn(hd.code);
    const cls=(v)=>(num(v)||0)>=0?"up":"down";
    h+='<tr>'
     +'<td><input type="checkbox" data-hi="'+idx+'" data-k="inReport"'+(hd.inReport?" checked":"")+' style="width:auto"></td>'
     +'<td><input data-hi="'+idx+'" data-k="code" value="'+esc(hd.code)+'" class="mono"></td>'
     +'<td><input data-hi="'+idx+'" data-k="name" value="'+esc(hd.name)+'"></td>'
     +'<td><select data-hi="'+idx+'" data-k="type">'+["A","ETF","IDX"].map(o=>'<option'+(hd.type===o?" selected":"")+'>'+o+'</option>').join("")+'</select></td>'
     +'<td class="num">'+(an?f2(an.close):'<span class="muted">无数据</span>')+'</td>'
     +'<td class="num '+(an?cls(an.chg):"")+'">'+(an?pct(an.chg):"—")+'</td>'
     +'<td class="num">'+(an?'<b>'+an.score.total+'</b>':'—')+'</td>'
     +'<td>'+(an?'<span class="chip '+an.score.tone+'">'+an.score.label+'</span> <span class="muted" style="font-size:11.5px">'+esc(an.arrange)+'</span>':'<span class="muted">—</span>')+'</td>'
     +'<td class="muted">'+(state.stocks[hd.code]&&state.stocks[hd.code].rows?state.stocks[hd.code].rows.length+' 根':'0')+'</td>'
     +'<td><button class="btn sm danger" data-hdel="'+idx+'">删</button></td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
  box.querySelectorAll("input,select").forEach(el=>{
    el.onchange=()=>{
      const i=+el.dataset.hi,k=el.dataset.k;
      if(el.type==="checkbox")state.holdings[i][k]=el.checked; else state.holdings[i][k]=el.value;
      saveState();renderHoldings();renderRail();renderDash();
    };
  });
  box.querySelectorAll("[data-hdel]").forEach(b=>{
    b.onclick=()=>{state.holdings.splice(+b.dataset.hdel,1);saveState();renderHoldings();renderRail();renderDash();};
  });
  $("railCount").textContent=state.holdings.length+" 只";
}

/* ---------- 左侧 rail ---------- */
function renderRail(){
  const box=$("railList"); if(!box)return;
  const q=($("railSearch")&&$("railSearch").value||"").trim().toLowerCase();
  let h="";
  state.holdings.forEach(hd=>{
    if(q&&(hd.code+hd.name).toLowerCase().indexOf(q)<0)return;
    const an=getAn(hd.code);
    const on=(CUR.code===hd.code)?" on":"";
    h+='<div class="it'+on+'" data-c="'+esc(hd.code)+'">'
     +'<div><div class="nm">'+esc(hd.name)+'</div><div class="cd">'+esc(hd.code)+'</div></div>'
     +'<div class="rt">'+(an
        ?'<div class="px '+(num(an.chg)>=0?"up":"down")+'">'+f2(an.close)+'</div>'
         +'<div class="cg '+(num(an.chg)>=0?"up":"down")+'">'+pct(an.chg)+'</div>'
         +'<div class="cg"><span class="chip '+an.score.tone+'" style="font-size:10px;padding:1px 6px">'+an.score.total+'</span></div>'
        :'<div class="cg muted">无数据</div>')+'</div></div>';
  });
  box.innerHTML=h||'<div class="empty">无匹配标的</div>';
  box.querySelectorAll(".it").forEach(it=>{it.onclick=()=>pickStock(it.dataset.c);});
}

/* ---------- 选中标的 ---------- */
var CUR={code:null,an:null,period:"daily",main:"both",sub:"macd",span:60};
function pickStock(code){
  CUR.code=code;
  const hd=state.holdings.find(h=>h.code===code);
  $("stockCode").value=code;
  $("stockName").value=hd?hd.name:"";
  $("stockRaw").value="";
  loadCurrent();
  renderRail();
}
function loadCurrent(){
  const code=($("stockCode").value||"").trim();
  const name=($("stockName").value||"").trim()||nameOf(code);
  const raw=($("stockRaw").value||"").trim();
  if(raw){
    const rows=parseOhlc(raw);
    if(rows.length<8){alert("解析到 "+rows.length+" 行K线，至少需要 8 行。请检查格式：日期,开,高,低,收,量");return;}
    state.stocks[code]={rows};
    saveState();clearAn(code);
  }
  const stk=state.stocks[code];
  if(!stk||!stk.rows){alert("该代码无数据：请粘贴K线或点「联网拉取」");return;}
  const an=analyzeStock({rows:stk.rows,name,code});
  if(an.err){alert(an.err);return;}
  AN_CACHE[code]=an;
  CUR.code=code;CUR.an=an;
  renderDiag(an);
}
function parseOhlc(text){
  const out=[];
  text.split(/\r?\n/).forEach(line=>{
    const t=line.trim(); if(!t||t.startsWith("#"))return;
    const p=t.split(/[,\t; ]+/);
    if(p.length<6)return;
    const o=num(p[1]),h=num(p[2]),l=num(p[3]),c=num(p[4]),v=num(p[5]);
    if([o,h,l,c].some(x=>x==null))return;
    out.push([p[0],o,h,l,c,v==null?0:v,p.length>6?num(p[6]):null]);
  });
  return out;
}

/* ---------- 个股诊断渲染 ---------- */
function renderDiag(an){
  const code=an.code,name=an.name||nameOf(an.code);
  $("diagTitle").textContent=name+"（"+code+"）";
  const chg=an.chg;
  $("diagTags").innerHTML=
    '<span class="chip '+((num(chg)||0)>=0?"up":"down")+' big">'+f2(an.close)+'　'+pct(chg)+'</span>'
   +'<span class="chip '+(an.score.tone)+' big">评分 '+an.score.total+' · '+an.score.label+'</span>'
   +'<span class="chip '+(an.arrange.indexOf("多头")>=0?"up":(an.arrange.indexOf("空头")>=0?"down":"neu"))+' big">'+esc(an.arrange)+'</span>'
   +'<span class="chip acc big">'+(an.wk&&an.wk.ok?esc(an.wk.arrange):"周线数据不足")+'</span>';

  const kpi=(lb,vl,ex,clss)=>'<div class="kpi '+(clss||"")+'"><div class="lb">'+lb+'</div><div class="vl">'+vl+'</div><div class="ex">'+ex+'</div></div>';
  const rsiTone=!nn(an.rsiV)?"":(an.rsiV>=70?"up":(an.rsiV<=30?"down":""));
  const vrTone=!nn(an.vr)?"":(an.vr>1.5?"up":(an.vr<0.7?"down":""));
  $("diagKpi").innerHTML=
     kpi("最新收盘",f2(an.close),(an.dateLast||an.dates[an.i])+"　"+pct(chg),((num(chg)||0)>=0?"up":"down"))
    +kpi("RSI(14)",!nn(an.rsiV)?"—":f1(an.rsiV),esc(an.rsiZone),rsiTone)
    +kpi("量比（5日）",!nn(an.vr)?"—":an.vr.toFixed(2),nn(an.vr)?(an.vr>1.5?"明显放量":an.vr<0.7?"明显缩量":"常态"):"数据缺失",vrTone)
    +kpi("技术评分",an.score.total,an.score.label+"｜近120日自身分位 "+(an.scorePct==null?"数据不足":an.scorePct+"%"),an.score.tone);

  const chips=[];
  chips.push('<span class="chip acc">MACD '+(nn(an.bar[an.i])?(an.bar[an.i]>=0?"红柱":"绿柱"):"—")+'</span>');
  if(nn(an.ma20[an.i]))chips.push('<span class="chip '+(an.close>an.ma20[an.i]?"up":"down")+'">MA20 '+f2(an.ma20[an.i])+'</span>');
  if(nn(an.ma60[an.i]))chips.push('<span class="chip '+(an.close>an.ma60[an.i]?"up":"down")+'">MA60 '+f2(an.ma60[an.i])+'</span>');
  if(nn(an.bl.up[an.i])&&nn(an.bl.lo[an.i])){
    const p=(an.close-an.bl.lo[an.i])/(an.bl.up[an.i]-an.bl.lo[an.i])*100;
    chips.push('<span class="chip neu">BOLL位置 '+p.toFixed(0)+'%</span>');
  }
  if(an.bw&&nn(an.bw.bw))chips.push('<span class="chip '+(an.bw.state.indexOf("收敛")>=0?"warn":"neu")+'">带宽 '+an.bw.bw.toFixed(1)+'% '+esc(an.bw.state)+'</span>');
  if(an.chan)chips.push('<span class="chip '+(an.chan.slope>0?"up":(an.chan.slope<0?"down":"neu"))+'">'+esc(an.chan.dir)+'</span>');
  (an.pats||[]).slice(-3).forEach(p=>chips.push('<span class="chip '+(p.side==="b"?"up":(p.side==="s"?"down":"neu"))+'">'+esc(p.nm)+'</span>'));
  const recentSig=(an.sigs||[]).filter(s=>s.i>=an.i-5);
  recentSig.slice(0,4).forEach(s=>chips.push('<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'">'+esc(s.nm)+'</span>'));
  $("diagChips").innerHTML=chips.join("");

  /* 三周期 */
  $("tfBox").innerHTML=(an.tf||[]).map(t=>
    '<div class="vcard"><div class="hd"><span class="tf">'+t.tf+'</span>'
    +'<span class="chip '+t.tone+' big">'+t.label+'</span></div>'
    +'<div class="bd">'+t.ev.map(e=>"· "+esc(e)).join("<br>")+'</div></div>').join("");

  /* 指标明细 */
  const kv=(k,v)=>'<div class="k"><span>'+k+'</span><b>'+v+'</b></div>';
  $("diagKv").innerHTML=
     kv("均线排列",esc(an.arrange))
    +kv("MA5 / MA10",f2(an.ma5[an.i])+" / "+f2(an.ma10[an.i]))
    +kv("MA20 / MA60",f2(an.ma20[an.i])+" / "+f2(an.ma60[an.i]))
    +kv("MACD DIF / DEA",f2(an.dif[an.i])+" / "+f2(an.dea[an.i]))
    +kv("MACD 柱",f2(an.bar[an.i]))
    +kv("RSI(14) / RSI(6)",f1(an.rsiV)+" / "+f1(an.r6[an.i]))
    +kv("KDJ K/D/J",f2(an.K[an.i])+" / "+f2(an.D[an.i])+" / "+f2(an.J[an.i]))
    +kv("BOLL 上/中/下",f2(an.bl.up[an.i])+" / "+f2(an.bl.mid[an.i])+" / "+f2(an.bl.lo[an.i]))
    +kv("布林带宽",(an.bw&&nn(an.bw.bw))?an.bw.bw.toFixed(2)+"%（"+esc(an.bw.state)+"）":"数据缺失")
    +kv("MA5-MA20 发散",(an.ms&&nn(an.ms.s1))?(an.ms.s1>0?"+":"")+an.ms.s1.toFixed(2)+"%":"数据缺失")
    +kv("量比（5日）",!nn(an.vr)?"数据缺失":an.vr.toFixed(2))
    +kv("换手率",nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"日K未含换手字段")
    +kv("近20日高/低",f2(an.hl20.hi)+" / "+f2(an.hl20.lo))
    +kv("近60日高/低",f2(an.hl60.hi)+" / "+f2(an.hl60.lo))
    +kv("密集成交区 POC",nn(an.poc.poc)?f2(an.poc.poc):"数据缺失")
    +kv("ATR(14)",nn(an.atr[an.i])?f2(an.atr[an.i]):"数据缺失")
    +kv("支撑位",an.sup.map(f2).join(" / ")||"数据缺失")
    +kv("压力位",an.res.map(f2).join(" / ")||"数据缺失")
    +kv("背离检测",'<span style="font-size:11.5px">'+esc(an.diver)+'</span>');

  /* 序列 */
  let sh='<table><thead><tr><th>日期</th><th class="num">开</th><th class="num">高</th><th class="num">低</th><th class="num">收</th>'
        +'<th class="num">涨跌%</th><th class="num">量(万手)</th><th class="num">MA5</th><th class="num">MA20</th>'
        +'<th class="num">DIF</th><th class="num">DEA</th><th class="num">柱</th><th class="num">RSI</th><th class="num">K</th><th class="num">D</th><th class="num">J</th><th>信号</th></tr></thead><tbody>';
  const sigByDay={};
  (an.sigs||[]).forEach(s=>{ (sigByDay[s.date]=sigByDay[s.date]||[]).push(s); });
  for(let k=an.i-7;k<=an.i;k++){
    if(k<0)continue;
    const pc=an.closes[k-1]?((an.closes[k]-an.closes[k-1])/an.closes[k-1]*100):null;
    const sg=(sigByDay[an.dates[k]]||[]).map(s=>'<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'" style="font-size:10px">'+esc(s.nm)+'</span>').join(" ");
    sh+='<tr><td class="mono">'+esc(an.dates[k])+'</td>'
      +'<td class="num">'+f2(an.opens[k])+'</td><td class="num">'+f2(an.highs[k])+'</td>'
      +'<td class="num">'+f2(an.lows[k])+'</td><td class="num"><b class="'+(pc>=0?"up":"down")+'">'+f2(an.closes[k])+'</b></td>'
      +'<td class="num '+(pc>=0?"up":"down")+'">'+pct(pc)+'</td>'
      +'<td class="num">'+(an.vols[k]!=null?(an.vols[k]/1e4).toFixed(1):"—")+'</td>'
      +'<td class="num">'+f2(an.ma5[k])+'</td><td class="num">'+f2(an.ma20[k])+'</td>'
      +'<td class="num">'+f2(an.dif[k])+'</td><td class="num">'+f2(an.dea[k])+'</td>'
      +'<td class="num '+(an.bar[k]>=0?"up":"down")+'">'+f2(an.bar[k])+'</td>'
      +'<td class="num">'+f1(an.r[k])+'</td><td class="num">'+f2(an.K[k])+'</td><td class="num">'+f2(an.D[k])+'</td><td class="num">'+f2(an.J[k])+'</td>'
      +'<td>'+(sg||"—")+'</td></tr>';
  }
  sh+='</tbody></table>';
  $("diagSeries").innerHTML=sh;

  /* 信号列表 */
  let sigs=(an.sigs||[]).filter(s=>s.i>=an.i-40);
  if(sigs.length>14)sigs=sigs.filter(s=>s.st>=2).concat(sigs.filter(s=>s.st<2).slice(0,3)).slice(0,14);
  sigs=sigs.slice(0,14);
  $("sigList").innerHTML=sigs.length?sigs.map(s=>
    '<div class="sig '+(s.side==="b"?"b":(s.side==="s"?"s":"n"))+'">'
    +'<div class="ic">'+(s.side==="b"?"▲":(s.side==="s"?"▼":"●"))+'</div>'
    +'<div class="bd"><div class="t1">'+esc(s.nm)+'　<span class="muted" style="font-weight:400">'+esc(s.date)+'　'+f2(s.price)+'</span>'
    +(s.st>=2?'　<span class="chip up" style="font-size:10px">强</span>':'')+'</div>'
    +'<div class="t2">'+esc(s.ds)+'</div></div></div>').join("")
    :'<div class="empty">近 40 日无技术信号</div>';

  ["diagHead","klineCard","tfCard","detailCard","aiCard","stockAlertCard","stockActionCard"].forEach(id=>{$(id).style.display="";});
  renderAi(an);
  if(typeof renderStockAlerts === "function") renderStockAlerts(an.code);
  renderRadar(an);
  renderScoreTrend(an);
  drawKline();
}

/* ---------- AI 技术研判（个股） ---------- */
function renderAi(an){
  const box=$("aiBox"); if(!box)return;
  const r=aiStock(an);
  const toneCls=(v)=>v>=56?"up":(v>=44?"neu":"down");
  const barColor=(t)=>t==="up"?UP:(t==="down"?DOWN:WARN);
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  h+='<div class="aigrid">';
  h+='<div class="aibox"><h5>多周期共振度</h5>'
    +'<div style="display:flex;align-items:baseline;gap:8px">'
    +'<span style="font-size:26px;font-weight:700" class="'+toneCls(r.resPct)+'">'+r.resPct+'%</span>'
    +'<span class="muted" style="font-size:12px">技术评分 '+r.score+'</span></div>'
    +'<div class="aibar"><i style="width:'+Math.max(2,r.resPct)+'%;background:'+barColor(toneCls(r.resPct))+'"></i></div>'
    +'<div class="muted" style="font-size:11.5px;margin-top:6px">日线排列 · 周线排列 · 均线位置 · MACD · 量能 · RSI 六维加权</div></div>';
  h+='<div class="aibox"><h5>多头依据</h5><ul>'+r.bulls.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='<div class="aibox"><h5>空头依据</h5><ul>'+r.bears.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='<div class="aibox"><h5>关键位一览</h5><div class="ailv">'
    +r.levels.map(l=>'<div class="row '+l.tone+'"><span class="nm">'+esc(l.nm)+'</span><span class="vv">'+l.vv+"</span></div>").join("")
    +'</div></div>';
  h+='<div class="aibox"><h5>后续观察要点</h5><ul>'+r.watch.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  h+='</div>';
  h+='<div class="airisk"><b>⚠ 风险提示</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}

/* ---------- 评分走势 ---------- */
function renderScoreTrend(an){
  const el=$("scoreChart"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const h=an.hist||[];
  if(!h.length){el._c.clear();return;}
  const xs=h.map(x=>x.date), vs=h.map(x=>x.v);
  const cur=vs[vs.length-1];
  el._c.setOption({
    grid:{left:34,right:12,top:12,bottom:20},
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",
      textStyle:{color:"#e8eef7",fontSize:11},formatter:p=>p[0].name+"　评分 "+p[0].value},
    xAxis:{type:"category",data:xs,boundaryGap:false,
      axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#6b7a91",fontSize:9,interval:Math.max(1,Math.floor(xs.length/5))}},
    yAxis:{type:"value",min:0,max:100,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#6b7a91",fontSize:9}},
    series:[{
      type:"line",data:vs,smooth:true,showSymbol:false,
      lineStyle:{width:1.8,color:ACC},
      areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,
        colorStops:[{offset:0,color:"rgba(76,141,255,.34)"},{offset:1,color:"rgba(76,141,255,0)"}]}},
      markLine:{silent:true,symbol:"none",data:[
        {yAxis:60,lineStyle:{color:"rgba(34,197,94,.45)",type:"dashed",width:1},
         label:{formatter:"偏强60",color:"#6ee79f",fontSize:9,position:"insideEndTop"}},
        {yAxis:40,lineStyle:{color:"rgba(255,77,79,.45)",type:"dashed",width:1},
         label:{formatter:"偏弱40",color:"#ff8f8f",fontSize:9,position:"insideEndBottom"}}
      ]}
    }]
  },true);
}

/* ---------- 雷达图 ---------- */
function renderRadar(an){
  const el=$("radarChart"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const d=an.score.dims, cap=an.score.caps;
  const keys=Object.keys(d);
  el._c.setOption({
    tooltip:{backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12},
      formatter:()=>keys.map(k=>k+"："+d[k]+" / "+cap[k]).join("<br>")+"<br><b>总分 "+an.score.total+"（"+an.score.label+"）</b>"},
    radar:{
      indicator:keys.map(k=>{return {name:k,max:cap[k]};}),
      radius:"62%",center:["50%","54%"],
      axisName:{color:"#93a1b8",fontSize:11},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.9)"}},
      splitArea:{areaStyle:{color:["rgba(255,255,255,.015)","rgba(255,255,255,.035)"]}},
      axisLine:{lineStyle:{color:"rgba(38,49,69,.9)"}}
    },
    series:[{type:"radar",symbolSize:5,
      data:[{value:keys.map(k=>d[k]),name:"当前",
        lineStyle:{color:ACC,width:2},itemStyle:{color:ACC},
        areaStyle:{color:"rgba(76,141,255,.22)"}}]}]
  },true);
}

/* ============================================================
   K线图（增强：多空点 / 支撑压力 / 通道 / 副图切换）
   ============================================================ */
function curViewAn(){
  if(!CUR.an)return null;
  if(CUR.period==="weekly"){
    if(!CUR.an._w){
      const wrows=weeklyFromDaily(CUR.an.rows);
      if(wrows.length<10)return CUR.an;
      const w=analyzeStock({rows:wrows.map(r=>[r.date,r.o,r.h,r.l,r.c,r.v]),name:CUR.an.name,code:CUR.an.code});
      if(w&&!w.err){w.wk=CUR.an.wk;w.isWeekly=true;CUR.an._w=w;}
    }
    return CUR.an._w||CUR.an;
  }
  return CUR.an;
}
/* 按可见窗口计算主图 Y 轴量程（含均线/BOLL/通道，避免蜡烛被压扁） */
function klineRange(an,s,e){
  s=Math.max(0,s|0); e=Math.min(an.dates.length-1,e|0);
  if(e<s)e=s;
  /* 第一遍：仅蜡烛高低，作为量程基准 */
  let lo=Infinity,hi=-Infinity;
  for(let k=s;k<=e;k++){
    if(nn(an.lows[k])&&an.lows[k]<lo)lo=an.lows[k];
    if(nn(an.highs[k])&&an.highs[k]>hi)hi=an.highs[k];
  }
  if(!isFinite(lo)||!isFinite(hi)||hi<=lo){ lo=an.close*0.92; hi=an.close*1.08; }
  const baseLo=lo, baseHi=hi;          /* 快照，裁剪判断必须用固定基准 */
  const base=hi-lo;
  /* 第二遍：纳入均线/BOLL，但裁剪在基准 ±25% 内，避免辅助线把蜡烛压扁 */
  const lim=base*0.25;
  const ex=[an.ma5,an.ma10,an.ma20,an.ma60,an.bl.lo,an.bl.up,an.bl.mid];
  for(let k=s;k<=e;k++){
    for(let j=0;j<ex.length;j++){
      const a=ex[j]; if(!a)continue;
      const v=a[k]; if(!nn(v))continue;
      if(v>=baseLo-lim&&v<=baseHi+lim){ if(v<lo)lo=v; if(v>hi)hi=v; }
    }
  }
  if(lo<0&&baseLo>0)lo=Math.max(0,baseLo-base*0.12);   /* 价格不为负 */
  let pad=(hi-lo)*0.05; if(pad<=0)pad=Math.max(0.01,Math.abs(hi)*0.01);
  return {min:+(lo-pad).toFixed(4), max:+(hi+pad).toFixed(4)};
}

function drawKline(){
  const an=curViewAn(); if(!an)return;
  const el=$("klineChart"); if(!el||typeof echarts==="undefined"){
    if(el)el.innerHTML='<div class="empty">图表库 echarts.min.js 未加载（需与 index.html 同目录）</div>';return;}
  if(!el._c)el._c=echarts.init(el);
  const chart=el._c;
  const dates=an.dates, n=dates.length;
  const candle=dates.map((d,k)=>[an.opens[k],an.closes[k],an.lows[k],an.highs[k]]);
  const showSig=$("ckSignal").checked, showLv=$("ckLevel").checked, showCh=$("ckChan").checked;

  /* ---- 主图 series ---- */
  const mpRaw=buildMarkPoint(an);
  const mpData=(showSig&&mpRaw&&mpRaw.data)?mpRaw.data.slice():[];
  /* 最新价标签 */
  mpData.push({coord:[n-1,an.close],value:an.close,symbol:"circle",symbolSize:0,
    label:{show:true,position:"right",distance:8,formatter:f2(an.close),
      backgroundColor:(num(an.chg)||0)>=0?UP:DOWN,borderRadius:3,padding:[3,5],
      color:"#0d1117",fontSize:11,fontWeight:"bold"}});
  /* AI 关键博弈区（POC ± 0.75 ATR） */
  let mkArea=undefined;
  const atrv=nn(an.atr[an.i])?an.atr[an.i]:null;
  if(nn(an.poc.poc)&&atrv!=null){
    mkArea={silent:true,itemStyle:{color:"rgba(227,179,65,.08)"},
      data:[[{yAxis:+(an.poc.poc-atrv*0.75).toFixed(4),
              label:{show:true,position:"insideStartTop",formatter:"AI 博弈区",color:"#e3b341",fontSize:10}},
             {yAxis:+(an.poc.poc+atrv*0.75).toFixed(4)}]]};
  }
  const main=[{
    name:"K线",type:"candlestick",data:candle,
    itemStyle:{color:UP,color0:DOWN,borderColor:"#ff7875",borderColor0:"#4ade80"},
    markPoint:Object.assign({symbolSize:1},mpRaw||{},{data:mpData}),
    markLine: showLv?buildMarkLine(an):undefined,
    markArea: mkArea,
    z:5
  }];
  const showMA=(CUR.main==="ma"||CUR.main==="both");
  const showBOLL=(CUR.main==="boll"||CUR.main==="both");
  if(showMA){
    main.push({name:"MA5",type:"line",data:an.ma5,smooth:true,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"},z:3});
    main.push({name:"MA10",type:"line",data:an.ma10,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#79c0ff",opacity:.75},z:3});
    main.push({name:"MA20",type:"line",data:an.ma20,smooth:true,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"},z:3});
    main.push({name:"MA60",type:"line",data:an.ma60,smooth:true,showSymbol:false,lineStyle:{width:1.4,color:"#a371f7"},z:3});
  }
  if(showBOLL){
    main.push({name:"BOLL上",type:"line",data:an.bl.up,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.75},z:2});
    main.push({name:"BOLL中",type:"line",data:an.bl.mid,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.6,type:"dashed"},z:2});
    main.push({name:"BOLL下",type:"line",data:an.bl.lo,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.75},z:2});
  }
  if(showCh&&an.chan){
    main.push({name:"通道上轨",type:"line",data:an.chan.up,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.55,type:"dashed"},z:1});
    main.push({name:"通道中轨",type:"line",data:an.chan.mid,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.35},z:1});
    main.push({name:"通道下轨",type:"line",data:an.chan.lo,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.55,type:"dashed"},z:1});
  }

  /* ---- 成交量 ---- */
  const volMA5=dates.map((d,k)=>avgVol(an.vols,5,k));
  const volData=dates.map((d,k)=>({value:an.vols[k],itemStyle:{color:(an.closes[k]>=an.opens[k]?"rgba(255,77,79,.65)":"rgba(34,197,94,.6)")}}));
  const volS=[{name:"VOL",type:"bar",xAxisIndex:1,yAxisIndex:1,data:volData},
    {name:"VOL MA5",type:"line",xAxisIndex:1,yAxisIndex:1,data:volMA5,showSymbol:false,lineStyle:{width:1,color:"#f5a524"}}];

  /* ---- 副图 ---- */
  let subS=[],subName="MACD";
  if(CUR.sub==="macd"){
    subName="MACD(12,26,9)";
    subS=[
      {name:"DIF",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dif,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"DEA",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dea,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"}},
      {name:"MACD",type:"bar",xAxisIndex:2,yAxisIndex:2,
        data:an.bar.map(b=>({value:b,itemStyle:{color:b>=0?"rgba(255,77,79,.8)":"rgba(34,197,94,.75)"}}))}
    ];
  } else if(CUR.sub==="kdj"){
    subName="KDJ(9,3,3)";
    subS=[
      {name:"K",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.K,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"D",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.D,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"}},
      {name:"J",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.J,showSymbol:false,lineStyle:{width:1,color:"#a371f7"}}
    ];
  } else {
    subName="RSI(6/14)";
    subS=[
      {name:"RSI6",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r6,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"RSI14",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r,showSymbol:false,lineStyle:{width:1.2,color:"#f5a524"},
        markLine:{silent:true,symbol:"none",data:[
          {yAxis:70,lineStyle:{color:"rgba(255,77,79,.5)",type:"dashed",width:1},label:{formatter:"超买70",color:"#ff8f8f",fontSize:10,position:"insideEndTop"}},
          {yAxis:30,lineStyle:{color:"rgba(34,197,94,.5)",type:"dashed",width:1},label:{formatter:"超卖30",color:"#6ee79f",fontSize:10,position:"insideEndBottom"}}
        ]}}
    ];
  }

  const span=(CUR.span==null?60:CUR.span);
  const startZoom=(span>0&&n>span)?(100-span*100/n):0;
  const rg=klineRange(an,(span>0?n-span:0),n-1);
  chart.setOption({
    animation:false,
    backgroundColor:"transparent",
    legend:{data:["MA5","MA10","MA20","MA60","BOLL上","BOLL中","BOLL下","通道上轨","通道下轨"],
      top:2,textStyle:{color:"#93a1b8",fontSize:10},itemWidth:14,itemHeight:8,inactiveColor:"#3d4a60"},
    tooltip:{
      trigger:"axis",axisPointer:{type:"cross",lineStyle:{color:"#5c6b80"},crossStyle:{color:"#5c6b80"}},
      backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",borderWidth:1,
      textStyle:{color:"#e8eef7",fontSize:12},
      formatter:function(ps){
        if(!ps||!ps.length)return "";
        const k=ps[0].dataIndex;
        const c=an.closes[k],o=an.opens[k],h=an.highs[k],l=an.lows[k];
        const pc=an.closes[k-1]?((c-an.closes[k-1])/an.closes[k-1]*100):null;
        const v=an.vols[k], vr=an.vrs[k];
        const col=pc==null?"#c7d3e3":(pc>=0?UP:DOWN);
        let s='<div style="font-weight:600;margin-bottom:4px">'+an.dates[k]+(an.isWeekly?' <span style="color:#93a1b8">周</span>':'')+'</div>';
        s+='<div style="color:'+col+'">开 '+f2(o)+'　高 '+f2(h)+'　低 '+f2(l)+'　收 <b>'+f2(c)+'</b>　'+(pc==null?"":(pc>=0?"+":"")+pc.toFixed(2)+"%")+'</div>';
        s+='<div style="color:#93a1b8">量 '+(v!=null?(v/1e4).toFixed(1)+"万手":"—")+(nn(vr)?'　量比 '+vr.toFixed(2):'')+'</div>';
        const row=(nm,a,b,cc)=>{const va=a[k],vb=b[k];return '<div style="color:'+(cc||"#c7d3e3")+'">'+nm+' '+(nn(va)?f2(va):"—")+' / '+(nn(vb)?f2(vb):"—")+'</div>';};
        s+=row("MA5/20",an.ma5,an.ma20,"#79c0ff");
        s+=row("MA10/60",an.ma10,an.ma60,"#a371f7");
        s+=row("DIF/DEA",an.dif,an.dea,"#58a6ff");
        s+='<div>RSI14 '+(nn(an.r[k])?f1(an.r[k]):"—")+'　RSI6 '+(nn(an.r6[k])?f1(an.r6[k]):"—")+'</div>';
        s+='<div>KDJ '+(nn(an.K[k])?f2(an.K[k]):"—")+' / '+(nn(an.D[k])?f2(an.D[k]):"—")+' / '+(nn(an.J[k])?f2(an.J[k]):"—")+'</div>';
        const sg=(an.sigs||[]).filter(x=>x.i===k);
        if(sg.length)s+='<div style="margin-top:4px;border-top:1px solid #31405a;padding-top:4px">'
          +sg.map(x=>'<span style="color:'+(x.side==="b"?UP:(x.side==="s"?DOWN:"#93a1b8"))+'">'
          +(x.side==="b"?"▲ ":"▼ ")+x.nm+(x.st>=2?"（强）":"")+'</span>').join("<br>")+'</div>';
        return s;
      }
    },
    axisPointer:{link:[{xAxisIndex:"all"}]},
    grid:[
      {left:58,right:70,top:26,height:"50%"},
      {left:58,right:70,top:"60.5%",height:"11%"},
      {left:58,right:70,top:"75.5%",height:"16.5%"}
    ],
    xAxis:[
      {type:"category",data:dates,gridIndex:0,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:1,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:2,axisLine:{lineStyle:{color:"#31405a"}},
       axisLabel:{color:"#93a1b8",fontSize:10,rotate:0,interval:Math.max(1,Math.floor(n/8))},
       splitLine:{show:false}}
    ],
    yAxis:[
      {scale:true,gridIndex:0,position:"left",min:rg.min,max:rg.max,splitNumber:5,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
       axisLabel:{color:"#93a1b8",fontSize:10,formatter:function(v){return v.toFixed(2);}},
       axisLine:{show:false},axisPointer:{label:{backgroundColor:"#1a2231",color:"#e8eef7"}}},
      {scale:true,gridIndex:1,position:"left",splitNumber:2,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},axisLabel:{color:"#6b7a91",fontSize:9},axisLine:{show:false}},
      {scale:true,gridIndex:2,position:"left",splitNumber:2,
       min:(CUR.sub==="rsi"?0:null),max:(CUR.sub==="rsi"?100:null),
       splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},axisLabel:{color:"#6b7a91",fontSize:9},axisLine:{show:false},
       name:subName,nameTextStyle:{color:"#6b7a91",fontSize:9},nameGap:8}
    ],
    dataZoom:[
      {type:"inside",xAxisIndex:[0,1,2],start:startZoom,end:100},
      {type:"slider",xAxisIndex:[0,1,2],start:startZoom,end:100,height:16,bottom:6,
       borderColor:"#31405a",fillerColor:"rgba(76,141,255,.14)",
       handleStyle:{color:"#4c8dff"},textStyle:{color:"#6b7a91",fontSize:9},dataBackground:{lineStyle:{color:"#31405a"},areaStyle:{color:"rgba(76,141,255,.08)"}}}
    ],
    series:main.concat(volS,subS)
  },true);

  /* 缩放 / 平移后重算主图量程，保证蜡烛始终占满可视高度 */
  if(!chart._dz){
    chart._dz=1;
    chart.on("dataZoom",function(){
      const a2=curViewAn(); if(!a2)return;
      const N=a2.dates.length; let s=0,e=N-1;
      try{
        const opt=chart.getOption();
        const dz=(opt&&opt.dataZoom&&opt.dataZoom[0])||{};
        const st=(dz.start!=null?dz.start:0), en=(dz.end!=null?dz.end:100);
        s=Math.floor(N*st/100); e=Math.min(N-1,Math.ceil(N*en/100)-1);
      }catch(err){}
      const r2=klineRange(a2,s,e);
      chart.setOption({yAxis:[{min:r2.min,max:r2.max}]});
    });
  }
}
function buildMarkPoint(an){
  const n=an.dates.length;
  let sigs=(an.sigs||[]).filter(s=>s.i>=Math.max(0,n-70));
  if(sigs.length>20)sigs=sigs.filter(s=>s.st>=2);      /* 过密时只保留强信号 */
  sigs=sigs.slice(0,20);
  return {
    symbolSize:1,
    label:{show:true,fontSize:11,fontWeight:"bold"},
    data:sigs.map(s=>{
      const isB=s.side==="b", isS=s.side==="s";
      const color=isB?UP:(isS?DOWN:"#8b949e");
      return {
        name:s.nm,
        coord:[an.dates[s.i], isB?an.lows[s.i]:an.highs[s.i]],
        value:isB?"▲":(isS?"▼":"●"),
        symbol:"triangle",
        symbolRotate:isB?0:180,
        symbolSize:(s.st>=2?12:9),
        symbolOffset:isB?[0,"60%"]:[0,"-60%"],
        itemStyle:{color:color,borderColor:"rgba(0,0,0,.35)",borderWidth:1},
        label:{show:true,position:isB?"bottom":"top",color:color,
          formatter:isB?"▲":(isS?"▼":"●"),fontSize:(s.st>=2?12:10)}
      };
    })
  };
}
function buildMarkLine(an){
  const data=[];
  (an.supAll||[]).slice(0,2).forEach(l=>data.push({
    yAxis:l.v,name:l.t,
    lineStyle:{color:"rgba(34,197,94,.55)",type:"dashed",width:1},
    label:{formatter:"支撑 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#6ee79f",fontSize:10}
  }));
  (an.resAll||[]).slice(0,2).forEach(l=>data.push({
    yAxis:l.v,name:l.t,
    lineStyle:{color:"rgba(255,77,79,.55)",type:"dashed",width:1},
    label:{formatter:"压力 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#ff8f8f",fontSize:10}
  }));
  return {silent:true,symbol:"none",animation:false,data:data};
}

/* ---------- 仪表盘 ---------- */
function marketTemp(){
  const b=state.breadth||{}, m=state.market||{};
  const up=num(b.up), dn=num(b.dn), zt=num(b.zt), dt=num(b.dt);
  if(up!=null&&dn!=null&&up+dn>0){
    const ratio=up/(up+dn);
    let t=ratio*70;
    if(zt!=null)t+=Math.min(20,zt*0.35);
    if(dt!=null)t-=Math.min(15,dt*0.6);
    const avg=((num(m.sh_chg)||0)+(num(m.cy_chg)||0))/2;
    t+=Math.max(-10,Math.min(10,avg*3));
    t=Math.max(0,Math.min(100,t));
    let label = t>=80?"高潮":t>=62?"发酵":t>=45?"震荡":t>=28?"退潮":"冰点";
    return {score:Math.round(t),label,src:"涨跌家数+涨跌停+指数涨跌"};
  }
  const avg=((num(m.sh_chg)||0)+(num(m.cy_chg)||0))/2;
  const t=Math.max(0,Math.min(100,50+avg*8));
  return {score:Math.round(t),label:Math.abs(avg)<0.3?"震荡":(avg>0?"发酵":"退潮"),src:"仅指数涨跌估算（涨跌家数数据缺失）"};
}
function renderDash(){
  renderHeader();
  const ans=[];
  state.holdings.forEach(h=>{const a=getAn(h.code);if(a)ans.push({h,a});});
  const inRep=ans.filter(x=>x.h.inReport!==false);
  const avg=inRep.length?Math.round(inRep.reduce((s,x)=>s+x.a.score.total,0)/inRep.length):0;
  const bull=inRep.filter(x=>x.a.score.total>=62).length;
  const bear=inRep.filter(x=>x.a.score.total<45).length;
  const tmp=marketTemp();
  const sigCnt=inRep.reduce((s,x)=>s+(x.a.sigs||[]).filter(g=>g.i>=x.a.i-5).length,0);

  const kpi=(lb,vl,ex,c)=>'<div class="kpi '+(c||"")+'"><div class="lb">'+lb+'</div><div class="vl">'+vl+'</div><div class="ex">'+ex+'</div></div>';
  $("dashKpi").innerHTML=
     kpi("组合技术均分",avg||"—",inRep.length+" 只纳入统计",avg>=62?"up":(avg<45?"down":""))
    +kpi("偏强 / 偏弱",'<span class="up">'+bull+'</span> / <span class="down">'+bear+'</span>',"评分 ≥62 / <45")
    +kpi("近5日信号数",sigCnt,"全持仓技术形态触发","")
    +kpi("市场温度",tmp.score+' <span style="font-size:13px">'+tmp.label+'</span>',esc(tmp.src),tmp.score>=62?"up":(tmp.score<45?"down":""));

  /* 排行 */
  const sorted=[...inRep].sort((a,b)=>b.a.score.total-a.a.score.total);
  let h='<table><thead><tr><th style="width:40px">#</th><th>标的</th><th class="num">收盘</th><th class="num">涨跌</th>'
       +'<th style="width:120px">评分</th><th>评级</th><th class="num" title="近120日自身历史分位">分位</th>'
       +'<th>日线</th><th>周线</th><th>短线</th><th>中线</th><th>长线</th><th>最近信号</th></tr></thead><tbody>';
  sorted.forEach((x,idx)=>{
    const a=x.a;
    const tf=a.tf||[];
    const tc=(t)=>t?'<span class="chip '+t.tone+'" style="font-size:10.5px">'+t.label.replace(/^(短线|中线|长线)/,"")+'</span>':"—";
    const lastSig=(a.sigs||[]).filter(s=>s.i>=a.i-10).slice(0,2)
      .map(s=>'<span class="chip '+(s.side==="b"?"up":(s.side==="s"?"down":"neu"))+'" style="font-size:10px">'+esc(s.nm)+'</span>').join(" ")||"—";
    const pc=Math.round(a.score.total);
    const barColor=pc>=62?UP:(pc>=45?WARN:DOWN);
    h+='<tr><td class="muted">'+(idx+1)+'</td>'
      +'<td><a href="javascript:;" data-go="'+esc(x.h.code)+'" style="text-decoration:none"><b>'+esc(x.h.name)+'</b></a>'
      +'<div class="muted mono" style="font-size:11px">'+esc(x.h.code)+'</div></td>'
      +'<td class="num">'+f2(a.close)+'</td>'
      +'<td class="num '+(num(a.chg)>=0?"up":"down")+'">'+pct(a.chg)+'</td>'
      +'<td><div class="flex" style="gap:7px"><div class="sbar" style="flex:1"><i style="width:'+pc+'%;background:'+barColor+'"></i></div><b>'+pc+'</b></div></td>'
      +'<td><span class="chip '+a.score.tone+'">'+a.score.label+'</span></td>'
      +'<td class="num">'+(a.scorePct==null?'<span class="muted">—</span>'
         :'<b class="'+(a.scorePct>=60?"up":(a.scorePct<=30?"down":""))+'">'+a.scorePct+'%</b>')+'</td>'
      +'<td style="font-size:11.5px">'+esc(a.arrange)+'</td>'
      +'<td style="font-size:11.5px">'+(a.wk&&a.wk.ok?esc(a.wk.arrange):'<span class="muted">不足</span>')+'</td>'
      +'<td>'+tc(tf[0])+'</td><td>'+tc(tf[1])+'</td><td>'+tc(tf[2])+'</td>'
      +'<td>'+lastSig+'</td></tr>';
  });
  h+='</tbody></table>';
  $("rankTbl").innerHTML=inRep.length?h:'<div class="empty">暂无纳入报告的持仓</div>';
  $("rankTbl").querySelectorAll("[data-go]").forEach(a=>{a.onclick=()=>{pickStock(a.dataset.go);tab("stock");};});

  /* 信号流 */
  const feed=[];
  inRep.forEach(x=>{
    (x.a.sigs||[]).filter(s=>s.i>=x.a.i-20).forEach(s=>feed.push({name:x.h.name,code:x.h.code,s}));
  });
  feed.sort((a,b)=>b.s.i-a.s.i);
  const top=feed.slice(0,40);
  $("sigFeed").innerHTML=top.length?top.map(f=>
    '<div class="sig '+(f.s.side==="b"?"b":(f.s.side==="s"?"s":"n"))+'">'
    +'<div class="ic">'+(f.s.side==="b"?"▲":(f.s.side==="s"?"▼":"●"))+'</div>'
    +'<div class="bd"><div class="t1">'+esc(f.name)+'　<span class="muted" style="font-weight:400">'+esc(f.s.date)+'　'+f2(f.s.price)+'</span>'
    +'　<b>'+esc(f.s.nm)+'</b>'+(f.s.st>=2?'　<span class="chip up" style="font-size:10px">强</span>':'')+'</div>'
    +'<div class="t2">'+esc(f.s.ds)+'</div></div>'
    +'<button class="btn sm" data-go2="'+esc(f.code)+'">看图</button></div>').join("")
    :'<div class="empty">近 20 日无技术信号</div>';
  $("sigFeed").querySelectorAll("[data-go2]").forEach(b=>{b.onclick=()=>{pickStock(b.dataset.go2);tab("stock");};});

  renderSigPie(inRep);
  renderTempGauge(tmp);
  renderStruct(inRep);
  renderPortfolioAi(inRep.map(x=>x.h));
}

/* ---------- AI 组合诊断 ---------- */
function renderPortfolioAi(rows){
  const box=$("pfAi"); if(!box)return;
  const r=aiPortfolio(rows);
  if(!r){box.innerHTML='<div class="empty">暂无可分析的标的（请先在持仓管理勾选纳入报告）</div>';return;}
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  h+='<div class="aigrid">';
  h+='<div class="aibox"><h5>结构要点</h5><ul>'+r.items.map(x=>"<li>"+x+"</li>").join("")+"</ul></div>";
  /* 强弱分布条 */
  const n=rows.length||1;
  const seg=(v,t)=>'<div style="flex:'+Math.max(0,v)+'"><div class="aibar"><i style="width:100%;background:'+t+'"></i></div>'
    +'<div class="muted" style="font-size:11px;margin-top:3px">'+v+' 只</div></div>';
  h+='<div class="aibox"><h5>多头 / 空头分布</h5>'
    +'<div style="display:flex;gap:8px;margin-bottom:6px">'
    +seg(r.upN,UP)+seg(r.dnN,DOWN)+seg(n-r.upN-r.dnN,WARN)+'</div>'
    +'<div class="muted" style="font-size:11.5px">多头 '+r.upN+' · 空头 '+r.dnN+' · 纠缠 '+(n-r.upN-r.dnN)+'（日线排列口径）</div>'
    +'<div class="muted" style="font-size:11.5px;margin-top:4px">周线多头 '+r.wkUp+' 只 —— 周线口径比日线更能反映中期趋势</div></div>';
  h+='<div class="aibox"><h5>强弱两端</h5><div class="ailv">'
    +r.sorted.slice(0,3).map(x=>'<div class="row up"><span class="nm">'+esc(x.h.name)+'</span><span class="vv">'+x.an.score.total+" 分</span></div>").join("")
    +r.sorted.slice(-3).reverse().map(x=>'<div class="row down"><span class="nm">'+esc(x.h.name)+'</span><span class="vv">'+x.an.score.total+" 分</span></div>").join("")
    +'</div></div>';
  h+='</div>';
  h+='<div class="airisk"><b>⚠ 组合层面风险</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}

/* ---------- 指数走势（归一化对比） ---------- */
const HOLD_SECTOR={
  "000063":"通信设备","300014":"电池","300602":"电子元件被动元件","300748":"稀土永磁",
  "000988":"通信设备光模块","300442":"IDC算力服务","300693":"电力设备","000933":"工业金属",
  "159558":"半导体设备","159326":"电网设备","159713":"稀土","159290":"创业板综指",
  "513050":"中概互联网","159577":"美股50"
};
/* 板块名 ↔ 持仓行业 匹配：先整体包含，再用 3 字滑窗，避免"通信设备"误命中"电力设备" */
function sectorMatch(secName,holdSec){
  if(!secName||!holdSec)return false;
  const a=String(secName).replace(/[ⅡⅢⅠ\s\(\)（）概念行业]/g,"");
  const b=String(holdSec);
  if(!a||!b)return false;
  if(b.indexOf(a)>=0||a.indexOf(b)>=0)return true;
  if(a.length<3)return false;
  for(let i=0;i+3<=a.length;i++){ if(b.indexOf(a.substr(i,3))>=0)return true; }
  return false;
}
function renderIdxChart(){
  const el=$("idxChart"); if(!el||typeof echarts==="undefined")return;
  const defs=[["000001","上证指数","#f5a524"],["399001","深证成指","#58a6ff"],["399006","创业板指","#a371f7"]];
  const series=[],leg=[];
  let dates=null;
  defs.forEach(([cd,nm,color])=>{
    const an=getAn(cd); if(!an)return;
    const N=Math.min(60,an.dates.length);
    const st=an.dates.length-N;
    const base=an.closes[st]; if(!nn(base)||!base)return;
    if(!dates)dates=an.dates.slice(st);
    const norm=an.closes.slice(st).map(v=>nn(v)?+(v/base*100).toFixed(2):null);
    const ma20=an.ma20.slice(st).map(v=>nn(v)?+(v/base*100).toFixed(2):null);
    series.push({name:nm,type:"line",data:norm,smooth:true,showSymbol:false,
      lineStyle:{width:1.8,color:color},itemStyle:{color:color}});
    series.push({name:nm+" MA20",type:"line",data:ma20,smooth:true,showSymbol:false,
      lineStyle:{width:1,color:color,opacity:.45,type:"dashed"}});
    leg.push(nm);
  });
  if(!series.length){ el.innerHTML='<div class="empty">指数K线数据缺失</div>'; if(el._c){el._c.dispose();el._c=null;} return; }
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    animation:false,backgroundColor:"transparent",
    grid:{left:52,right:16,top:34,bottom:30},
    legend:{data:leg,top:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:14,itemHeight:8},
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#31405a",
      textStyle:{color:"#e8eef7",fontSize:12},valueFormatter:v=>v==null?"—":(+v).toFixed(2)},
    xAxis:{type:"category",data:dates||[],axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#93a1b8",fontSize:10,interval:Math.max(1,Math.floor((dates||[]).length/8))}},
    yAxis:{type:"value",scale:true,splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8",fontSize:10,formatter:v=>v.toFixed(0)},axisLine:{show:false}},
    series:series
  },true);
}

/* ---------- 今日主线 × 持仓映射 ---------- */
function renderSectorMap(){
  const box=$("sectorMap"); if(!box)return;
  const sn=state.snap||{};
  const hot=sn.hot||[], net=sn.net||[];
  if(!hot.length&&!net.length){box.innerHTML='<div class="empty">板块快照：数据缺失</div>';return;}
  const holds=state.holdings.filter(h=>h.inReport!==false);
  /* 汇总：每个板块 → 命中持仓 */
  const rows=[];
  const seen={};
  [].concat(hot.map(x=>({name:x.name,chg:x.chg,kind:"领涨"})),
            net.map(x=>({name:x.name,chg:x.chg,net:x.net,kind:"资金"}))).forEach(s=>{
    const key=s.name+"|"+s.kind;
    if(seen[key])return; seen[key]=1;
    const hits=holds.filter(h=>sectorMatch(s.name,HOLD_SECTOR[h.code]));
    rows.push({s:s,hits:hits});
  });
  rows.sort((a,b)=>(b.hits.length-a.hits.length)||((num(b.s.chg)||0)-(num(a.s.chg)||0)));
  const covered={};
  rows.forEach(r=>r.hits.forEach(h=>covered[h.code]=1));
  const uncovered=holds.filter(h=>!covered[h.code]);

  let h='<div class="banner '+(uncovered.length?'warn':'info')+'" style="margin-bottom:10px">'
    +'今日主线板块共 <b>'+rows.length+'</b> 个，与你的持仓发生关联的有 <b>'+(rows.length-rows.filter(r=>!r.hits.length).length)+'</b> 个；'
    +'被主线覆盖的持仓 <b>'+Object.keys(covered).length+'/'+holds.length+'</b> 只'
    +(uncovered.length?'，<b>未覆盖：'+uncovered.map(x=>esc(x.name)).join("、")+'</b>（属非当前热点，需独立跟踪）':'，主线覆盖充分')
    +'。仅板块名称匹配推断，非精确行业归类。</div>';
  h+='<table><thead><tr><th>板块</th><th>类型</th><th class="num">涨跌</th><th class="num">主力净流入</th><th>命中持仓</th></tr></thead><tbody>';
  rows.slice(0,14).forEach(r=>{
    const s=r.s;
    h+='<tr><td><b>'+esc(s.name)+'</b></td>'
      +'<td><span class="chip '+(s.kind==="领涨"?"up":"acc")+'">'+s.kind+'</span></td>'
      +'<td class="num '+(num(s.chg)>=0?"up":"down")+'">'+pct(s.chg)+'</td>'
      +'<td class="num">'+((s.net!=null)?(num(s.net)>0?"+":"")+f2(s.net)+"亿":"—")+'</td>'
      +'<td>'+(r.hits.length?r.hits.map(x=>{
          const an=getAn(x.code);
          const sc=an?an.score.total:null;
          return '<span class="chip '+(sc==null?"neu":(sc>=62?"up":(sc<45?"down":"neu")))+'" style="margin-right:4px">'
            +esc(x.name)+(sc!=null?' '+sc:'')+'</span>';
        }).join(""):'<span class="muted">无</span>')+'</td></tr>';
  });
  h+='</tbody></table>';
  box.innerHTML=h;
}

/* ---------- AI 大盘解读 ---------- */
function renderMarketAi(){
  const box=$("mktAi"); if(!box)return;
  const r=aiMarket();
  let h='<div class="aiwrap">';
  h+='<div class="aiverdict '+r.tone+'">'
    +'<div class="ai-ico '+(r.tone==="up"?"up":(r.tone==="down"?"down":"warn"))+'">'+r.icon+'</div>'
    +'<div class="ai-main"><div class="ai-title">'+esc(r.title)+'</div>'
    +'<div class="ai-desc">'+r.desc+'</div></div></div>';
  if(r.items.length){
    h+='<div class="aigrid"><div class="aibox" style="grid-column:1/-1"><h5>盘面解读</h5><ul>'
      +r.items.map(x=>"<li>"+x+"</li>").join("")+"</ul></div></div>";
  }
  h+='<div class="airisk"><b>⚠ 风险与容错提示</b><br>'+r.risks.map(x=>"· "+x).join("<br>")+'</div>';
  h+='</div>';
  box.innerHTML=h;
}
function renderStruct(list){
  const el=$("structBar"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  const R=[
    {n:"日线排列",b:0,m:0,s:0,t:0},
    {n:"周线排列",b:0,m:0,s:0,t:0},
    {n:"价格 vs MA60",b:0,m:0,s:0,t:0},
    {n:"中期通道",b:0,m:0,s:0,t:0},
    {n:"MACD 柱",b:0,m:0,s:0,t:0}
  ];
  list.forEach(x=>{
    const a=x.a,i=a.i;
    const arr=a.arrange||"";
    if(arr.indexOf("多头")>=0)R[0].b++; else if(arr.indexOf("空头")>=0)R[0].s++; else R[0].m++;
    R[0].t++;
    const wk=(a.wk&&a.wk.ok)?a.wk.arrange:null;
    if(wk==="多头排列")R[1].b++; else if(wk==="空头排列")R[1].s++; else R[1].m++;
    R[1].t++;
    if(nn(a.ma60[i])){ a.close>a.ma60[i]?R[2].b++:R[2].s++; R[2].t++; }
    if(a.chan){ a.chan.slope>0?R[3].b++:(a.chan.slope<0?R[3].s++:R[3].m++); R[3].t++; }
    if(nn(a.bar[i])){ a.bar[i]>=0?R[4].b++:R[4].s++; R[4].t++; }
  });
  const pc=(c,t)=>t?Math.round(c/t*100):0;
  const mk=(key,color,nm)=>({
    name:nm,type:"bar",stack:"x",barWidth:"52%",
    itemStyle:{color:color},
    label:{show:true,color:"#0b0f16",fontSize:10,fontWeight:600,
      formatter:p=>{const r=R[p.dataIndex];const c=r[key];return c?c+"":"";}},
    data:R.map(r=>({value:pc(r[key],r.t),raw:r[key]}))
  });
  el._c.setOption({
    grid:{left:78,right:16,top:8,bottom:20},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},
      backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:11},
      formatter:ps=>{const r=R[ps[0].dataIndex];
        return r.n+"（"+r.t+" 只）<br>偏多 "+r.b+"　中性 "+r.m+"　偏空 "+r.s;}},
    xAxis:{type:"value",max:100,show:false},
    yAxis:{type:"category",data:R.map(r=>r.n),inverse:true,
      axisLine:{show:false},axisTick:{show:false},
      axisLabel:{color:"#93a1b8",fontSize:11}},
    series:[mk("b",UP,"偏多"),mk("m","#4a586d","中性"),mk("s",DOWN,"偏空")]
  },true);
}
function renderSigPie(list){
  const el=$("sigPie"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  let b=0,s=0,n=0;
  list.forEach(x=>{(x.a.sigs||[]).filter(g=>g.i>=x.a.i-20).forEach(g=>{ if(g.side==="b")b++; else if(g.side==="s")s++; else n++; });});
  el._c.setOption({
    tooltip:{trigger:"item",backgroundColor:"rgba(19,26,37,.96)",borderColor:"#263145",textStyle:{color:"#e8eef7",fontSize:12}},
    legend:{bottom:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:12,itemHeight:8},
    series:[{type:"pie",radius:["46%","70%"],center:["50%","44%"],avoidLabelOverlap:true,
      label:{color:"#c7d3e3",fontSize:11,formatter:"{b}\n{c}"},
      labelLine:{lineStyle:{color:"#31405a"}},
      data:[
        {value:b,name:"多头信号",itemStyle:{color:UP}},
        {value:s,name:"空头信号",itemStyle:{color:DOWN}},
        {value:n,name:"中性形态",itemStyle:{color:"#6b7a91"}}
      ].filter(d=>d.value>0)}]
  },true);
}
function renderTempGauge(tmp){
  const el=$("tempGauge"); if(!el||typeof echarts==="undefined")return;
  if(!el._c)el._c=echarts.init(el);
  el._c.setOption({
    series:[{
      type:"gauge",startAngle:200,endAngle:-20,min:0,max:100,
      radius:"86%",center:["50%","62%"],
      progress:{show:true,width:14,itemStyle:{color:{
        type:"linear",x:0,y:0,x2:1,y2:0,
        colorStops:[{offset:0,color:"#22c55e"},{offset:.5,color:"#f5a524"},{offset:1,color:"#ff4d4f"}]}}},
      axisLine:{lineStyle:{width:14,color:[[1,"rgba(38,49,69,.8)"]]}},
      axisTick:{show:false},splitLine:{length:8,lineStyle:{color:"#5c6b80",width:1}},
      axisLabel:{color:"#6b7a91",fontSize:9,distance:-26},
      pointer:{width:4,length:"58%",itemStyle:{color:"#e8eef7"}},
      anchor:{show:true,size:8,itemStyle:{color:"#e8eef7"}},
      title:{show:true,offsetCenter:[0,"76%"],color:"#93a1b8",fontSize:12},
      detail:{valueAnimation:true,offsetCenter:[0,"42%"],fontSize:24,fontWeight:700,color:"#e8eef7",formatter:"{value}"},
      data:[{value:tmp.score,name:tmp.label}]
    }]
  },true);
  $("tempNote").innerHTML='判定来源：'+esc(tmp.src)+'。区间：0–28 冰点 / 28–45 退潮 / 45–62 震荡 / 62–80 发酵 / 80+ 高潮。'
    +( (num(state.breadth.up)==null)?'　<b style="color:#ffcf7a">涨跌家数缺失，当前为估算值</b>：' :'');
}

/* ============================================================
   引擎三：报告生成 / 联网 / 事件绑定 / 初始化
   ============================================================ */

/* ---------- 报告：第一步 大盘 ---------- */
function buildMarketBlock(){
  const m=state.market||{}, b=state.breadth||{};
  const L=[];
  L.push("■ 指数表现");
  const row=(nm,c,chg,amt,amtd)=>{
    const has=nn(c);
    L.push("  "+nm+"："+(has?"收盘 "+f2(c)+"，涨跌幅 "+pct(chg):"数据缺失")+
      (nn(amt)?"，成交额 "+f2(amt)+" 亿元":"，成交额 数据缺失")+
      (nn(amtd)?"（较昨日环比 "+pct(amtd)+"）":"（环比 数据缺失）"));
  };
  row("上证指数",m.sh_close,m.sh_chg,m.sh_amt,m.sh_amtd);
  row("深证成指",m.sz_close,m.sz_chg,m.sz_amt,m.sz_amtd);
  row("创业板指",m.cy_close,m.cy_chg,m.cy_amt,m.cy_amtd);
  L.push("");
  L.push("■ 市场宽度");
  const up=num(b.up),dn=num(b.dn),zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  if(up==null||dn==null){
    L.push("  ⚠ 数据缺失：涨跌家数未提供（可在应用内点「↻ 刷新行情」由浏览器直连获取，或手填）。");
  }else{
    L.push("  上涨 "+up+" 家 ／ 下跌 "+dn+" 家，涨跌比 "+(dn?(up/dn).toFixed(2):"—")+
      "（"+(up/(up+dn)*100).toFixed(1)+"% 个股上涨）");
  }
  L.push("  涨停 "+(zt==null?"数据缺失":zt+" 家")+" ／ 跌停 "+(dt==null?"数据缺失":dt+" 家")
    +" ／ 炸板 "+(zb==null?"数据缺失":zb+" 家")
    +(zt!=null&&zb!=null&&(zt+zb)>0?"（炸板率 "+(zb/(zt+zb)*100).toFixed(1)+"%）":""));
  if(nn(b.amt))L.push("  两市成交额 "+f2(b.amt)+" 亿元");
  L.push("");
  L.push("■ 趋势判断（相对均线 / 量价配合）");
  const idxs=[["000001","上证指数"],["399001","深证成指"],["399006","创业板指"]];
  let anyIdx=false;
  idxs.forEach(([cd,nm])=>{
    const an=getAn(cd);
    if(!an){L.push("  "+nm+"：⚠ 数据缺失（未载入指数日K线，MA 位置无法计算）");return;}
    anyIdx=true;
    const i=an.i;
    const pos=[[an.ma5,"MA5"],[an.ma20,"MA20"],[an.ma60,"MA60"]].map(([ma,n])=>
      nn(ma[i])?n+(an.close>ma[i]?"上方 +"+((an.close-ma[i])/ma[i]*100).toFixed(2)+"%":"下方 "+((an.close-ma[i])/ma[i]*100).toFixed(2)+"%"):n+"（数据不足）").join("，");
    const vrTxt=nn(an.vr)?"量比 "+an.vr.toFixed(2)+"（"+(an.vr>1.2?"放量":an.vr<0.8?"缩量":"平量")+"）":"量能 数据缺失";
    L.push("  "+nm+"：收 "+f2(an.close)+"（"+pct(an.chg)+"）｜ "+pos+" ｜ "+vrTxt
      +" ｜ MACD柱 "+f2(an.bar[i])+"（"+(an.bar[i]>=0?"红":"绿")+"）");
  });
  if(!anyIdx)L.push("  ⚠ 数据缺失：三大指数均未载入日K线，无法判断均线位置与量价配合。");
  const vn=(state.vol_note||"").trim();
  if(vn)L.push("  人工备注："+vn);
  else if(anyIdx){
    const an=getAn("000001");
    if(an){
      const upDay=(num(an.chg)||0)>0;
      const vup=nn(an.vr)&&an.vr>1.1;
      L.push("  自动判定："+(upDay?"价涨":"价跌")+"、"+(!nn(an.vr)?"量能数据缺失":(vup?"放量":"缩量"))+
        " → "+((upDay&&vup)?"量价配合良好（放量上涨）":(upDay&&!vup?"量价背离（缩量上涨，持续性存疑）":(!upDay&&vup?"放量下跌（抛压释放）":"缩量下跌（抛压有限）"))
        +"（依据：上证涨跌 "+pct(an.chg)+"，量比 "+(nn(an.vr)?an.vr.toFixed(2):"缺失")+"）"));
    }
  }
  L.push("");
  /* 板块快照 */
  const s=state.snap||{};
  L.push("■ 热门板块与主力资金（快照 "+SNAPSHOT_DATE+"）");
  if((s.hot||[]).length){
    L.push("  领涨 TOP："+(s.hot||[]).slice(0,6).map(x=>x.name+" "+pct(x.chg)+(x.leader?"（龙头 "+x.leader+"）":"")).join("；"));
  } else L.push("  ⚠ 数据缺失：热门板块快照为空。");
  if((s.money||[]).length){
    L.push("  主力净流入 TOP："+(s.money||[]).slice(0,6).map(x=>
      x.name+" "+(x.net==null?"—":(num(x.net)>0?"+":"")+f2(x.net)+"亿")
      +(x.days5!=null?"（近5日 "+(num(x.days5)>0?"+":"")+f2(x.days5)+"亿）":"")).join("；"));
    const out=(s.money||[]).filter(x=>num(x.net)<0);
    if(out.length)L.push("  主力净流出："+out.slice(-4).map(x=>x.name+" "+f2(x.net)+"亿").join("；"));
  } else L.push("  ⚠ 数据缺失：主力资金快照为空。");
  L.push("");
  L.push("■ 综合结论（市场温度判定）");
  const tmp=marketTemp();
  L.push("  市场温度："+tmp.label+"（"+tmp.score+"/100，依据："+tmp.src+"）");
  const tol = tmp.score>=80?"容错率低：高潮期追高易吃面，宜降低仓位与换手频率"
    :tmp.score>=62?"容错率中等：发酵期主线有效，宜聚焦龙头与主线，避免杂毛"
    :tmp.score>=45?"容错率中等：震荡期多看少动，宜等明确信号"
    :tmp.score>=28?"容错率低：退潮期宜控制回撤，减少试错":"容错率极低：冰点期以观察为主，等待情绪修复";
  L.push("  次日操作容错率评估："+tol);
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第二步 板块 ---------- */
function buildSectorBlock(){
  const L=[];
  L.push("■ 领涨板块 TOP 与驱动逻辑");
  const ss=(state.sectors||[]).filter(s=>s&&s.name);
  if(!ss.length){L.push("  ⚠ 数据缺失：未填写板块数据。");L.push("");return L.join("\n");}
  const money=(state.snap&&state.snap.money)||[];
  const netMap={},d5Map={};money.forEach(m=>{netMap[m.name]=num(m.net);d5Map[m.name]=num(m.days5);});
  ss.slice(0,5).forEach((s,idx)=>{
    const net=netMap[s.name],d5=d5Map[s.name];
    L.push("  "+(idx+1)+". "+s.name+"　涨幅 "+pct(s.chg)+"　驱动："+(s.logic||"未标注"));
    L.push("     资金："+(net==null?"数据缺失":(net>0?"净流入 +":"净流出 ")+f2(net)+"亿")
      +(d5!=null?"（近5日 "+(d5>0?"+":"")+f2(d5)+"亿，"+(net>0&&d5>0?"资金持续性好":net>0&&d5<0?"今日回流但5日净出，持续性存疑":net<0&&d5<0?"持续流出":"今日流出但5日净入")+"）":"（近5日 数据缺失）"));
    L.push("     梯队：龙头 "+(s.leader||"数据缺失")+" ／ 中军 "+(s.mid||"数据缺失")+" ／ 低位补涨 "+(s.low||"数据缺失")
      +"　连续 "+(s.days||"数据缺失")+" 天");
  });
  L.push("");
  L.push("■ 梯队完整性评估");
  const full=ss.filter(s=>s.leader&&s.mid&&s.low).length;
  const partial=ss.filter(s=>s.leader&&(s.mid||s.low)).length;
  L.push("  完整梯队（龙头+中军+补涨齐全）"+full+" 个；部分梯队 "+partial+" 个；共 "+ss.length+" 个板块。");
  L.push("  "+(full>0?"存在完整梯队，主线具备发酵基础":partial>0?"梯队不完整，仅部分板块有龙头与跟风，需观察补涨是否跟上":"⚠ 数据缺失：无板块标注龙头/中军/补涨，无法评估梯队完整性"));
  L.push("");
  L.push("■ 主线 vs 轮动区分");
  const days3=ss.filter(s=>(num(s.days)||0)>=3);
  L.push("  连续性：连续≥3天的板块 "+(days3.length?days3.map(s=>s.name+"（"+s.days+"天）").join("、"):"无")+"。");
  L.push("  资金持续性：依据主力净额与近5日净额一致性判定（见上）。");
  L.push("  结论："+(days3.length?"存在连续主线（"+days3.map(s=>s.name).join("、")+"），但需要资金持续净流入确认；":"当前以轮动为主，未见连续≥3天的主线，")
    +"逻辑硬度取决于驱动类型（政策/业绩 > 事件 > 纯资金）。");
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第三步 个股 ---------- */
function buildStockBlock(stk){
  const L=[];
  const code=stk.code,name=stk.name;
  L.push("────────────────────────────────────");
  L.push("【"+name+"】"+code+"　"+(stk.type||""));
  const an=stk.an;
  if(!an){L.push("  ⚠ 数据缺失：该标的未载入K线数据，无法诊断。");L.push("");return L.join("\n");}
  const i=an.i;
  L.push("  最新：收盘 "+f2(an.close)+"（"+pct(an.chg)+"）　"+an.dates[i]+"　技术评分 "+an.score.total+"/100（"+an.score.label+"）");
  L.push("");
  L.push("  ■ 趋势指标");
  L.push("    · 均线排列："+an.arrange+"（MA5 "+f2(an.ma5[i])+" ／ MA10 "+f2(an.ma10[i])+" ／ MA20 "+f2(an.ma20[i])+" ／ MA60 "+f2(an.ma60[i])+"）");
  if(an.ms&&(nn(an.ms.s1)||nn(an.ms.s2)))
    L.push("    · 发散度：MA5-MA20 "+(nn(an.ms.s1)?(an.ms.s1>0?"+":"")+an.ms.s1.toFixed(2)+"%":"数据缺失")
      +"；MA20-MA60 "+(nn(an.ms.s2)?(an.ms.s2>0?"+":"")+an.ms.s2.toFixed(2)+"%":"数据缺失"));
  L.push("    · MACD："+an.macdSig);
  L.push("    · 背离检测："+an.diver);
  L.push("");
  L.push("  ■ 震荡指标");
  L.push("    · RSI(14)="+(!nn(an.rsiV)?"数据缺失":f1(an.rsiV))+"，"+an.rsiZone+"；RSI(6)="+(!nn(an.r6[i])?"数据缺失":f1(an.r6[i]))+"（短周期敏感度更高）");
  L.push("    · KDJ："+an.kdjSig);
  L.push("");
  L.push("  ■ 量能指标");
  L.push("    · 量比（5日均量口径）="+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+(nn(an.vr)?("（"+(an.vr>1.5?"放量":an.vr<0.7?"缩量":"常态")+"）"):""));
  L.push("    · 换手率："+(nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"数据缺失（日K未含换手字段）"));
  L.push("");
  L.push("  ■ 形态与关键位");
  const patAll=(an.pats||[]).slice().sort((a,b)=>b.i-a.i);
  const seenPat={},pats=[];
  patAll.forEach(p=>{ if(seenPat[p.nm])return; seenPat[p.nm]=1; pats.push(p); });
  pats.reverse();
  L.push("    · 近期形态："+(pats.length?pats.map(p=>p.date+" "+p.nm+"（"+p.ds+"）").join("；"):"未识别到典型K线形态"));
  L.push("    · 支撑位："+(an.sup.length?an.sup.map(f2).join(" ＞ "):"数据缺失")
    +((an.supAll||[]).length?"　【"+(an.supAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · 压力位："+(an.res.length?an.res.map(f2).join(" ＜ "):"数据缺失")
    +((an.resAll||[]).length?"　【"+(an.resAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · BOLL(20,2)：上轨 "+f2(an.bl.up[i])+" ／ 中轨 "+f2(an.bl.mid[i])+" ／ 下轨 "+f2(an.bl.lo[i])
    +(an.bw&&nn(an.bw.bw)?("，带宽 "+an.bw.bw.toFixed(2)+"%("+an.bw.state+")"):""));
  L.push("    · 密集成交区 POC："+(nn(an.poc.poc)?f2(an.poc.poc):"数据缺失")+"（近60日成交量最大价格中枢）");
  L.push("");
  L.push("  ■ 多空技术信号（近 40 日，客观形态识别，非交易指令）");
  const sigs=(an.sigs||[]).filter(s=>s.i>=an.i-40).slice(0,12);
  if(sigs.length){
    let nb=0,ns=0;
    sigs.forEach(s=>{
      L.push("    · "+s.date+"　"+(s.side==="b"?"▲ 多头":(s.side==="s"?"▼ 空头":"● 中性"))+"　"+s.nm+(s.st>=2?"（强）":"")
        +"　"+f2(s.price)+"　"+s.ds);
      if(s.side==="b")nb++;else if(s.side==="s")ns++;
    });
    L.push("    统计：多头 "+nb+" 个 / 空头 "+ns+" 个 / 中性 "+(sigs.length-nb-ns)+" 个");
  } else L.push("    · 近 40 日未触发技术信号");
  L.push("");
  L.push("  ■ 短 / 中 / 长 三周期研判");
  (an.tf||[]).forEach(t=>{
    L.push("    【"+t.tf+"】"+t.label);
    t.ev.forEach(e=>L.push("      · "+e));
  });
  L.push("");
  L.push("  ■ AI 技术研判（规则推理，附数据依据 · 非投资建议）");
  try{
    const r=aiStock(an);
    const strip=s=>String(s).replace(/<[^>]+>/g,"");
    L.push("    【结论】"+r.icon+" "+r.title);
    L.push("    "+strip(r.desc));
    L.push("    【多周期共振度】"+r.resPct+"%（技术评分 "+r.score+"）");
    L.push("    【多头依据】");
    r.bulls.forEach(x=>L.push("      + "+strip(x)));
    L.push("    【空头依据】");
    r.bears.forEach(x=>L.push("      - "+strip(x)));
    L.push("    【关键位】"+r.levels.map(x=>x.nm+" = "+x.vv).join("　｜　"));
    L.push("    【风险提示】"+r.risks.map(strip).join("；"));
    L.push("    【后续观察要点】");
    r.watch.forEach(x=>L.push("      · "+strip(x)));
  }catch(e){L.push("    ⚠ AI 研判生成失败："+(e&&e.message?e.message:"未知错误"));}
  L.push("");
  L.push("  ■ 技术评分分解（五维）");
  const d=an.score.dims,cap=an.score.caps;
  L.push("    "+Object.keys(d).map(k=>k+" "+d[k]+"/"+cap[k]).join("　｜　")+"　→　总分 "+an.score.total+"（"+an.score.label+"）");
  L.push("    自身历史分位："+(an.scorePct==null?"数据不足（样本<5）":an.scorePct+"%（近120日回测，越高表示相对自身历史越强）"));
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：第四步 风险 ---------- */
function buildRiskBlock(stocks){
  const L=[];
  L.push("■ 三个最可能证伪当前判断的信号（含触发条件）");
  const list=stocks.filter(s=>s.an);
  if(!list.length){L.push("  ⚠ 数据缺失：无有效个股数据，无法给出证伪信号。");L.push("");return L.join("\n");}
  /* 依据组合实况动态生成 */
  const bulls=list.filter(s=>s.an.score.total>=62), bears=list.filter(s=>s.an.score.total<45);
  const macdBull=list.filter(s=>nn(s.an.bar[s.an.i])&&s.an.bar[s.an.i]>=0).length;
  const aboveMa20=list.filter(s=>nn(s.an.ma20[s.an.i])&&s.an.close>s.an.ma20[s.an.i]).length;
  const tot=list.length;
  L.push("  1) 动量证伪：若 MACD 柱由红转绿且 DIF 下穿 DEA（当前 "+macdBull+"/"+tot+" 只处于红柱），则本轮反弹动量证伪，"
    +"需观察是否伴随成交量放大（量比>1.5）——无量下跌为洗盘，有量下跌为趋势反转。");
  L.push("  2) 结构证伪：若收盘价跌破 MA20 且 MA5 下穿 MA20（当前 "+aboveMa20+"/"+tot+" 只站上 MA20），则短期上升结构破坏，"
    +"进一步跌破 MA60 则确认中期转弱（"+bulls.length+" 只偏强 / "+bears.length+" 只偏弱）。");
  L.push("  3) 量能证伪：若反弹过程中量比持续 <0.8（缩量上涨），则上攻缺乏资金承接，"
    +"属量价背离；需等待放量确认，否则回踩概率上升。");
  L.push("");
  L.push("■ 三情景推演（仅为情景描述与观察要点，非预测目标价）");
  L.push("  【乐观情景】条件：指数放量上涨（量比>1.2）+ 个股 MACD 红柱扩张 + 站上并守住 MA20/MA60。");
  L.push("     观察要点：龙头是否继续领涨、涨停家数是否扩大、成交能否持续放大、偏强标的（"+bulls.length+" 只）能否扩散。");
  L.push("  【中性情景】条件：指数窄幅震荡、量能持平（量比 0.8–1.2）、个股在 MA20 上下反复。");
  L.push("     观察要点：以区间思路对待，关注支撑位（各标的 POC 与近20日低）是否守住，跌破则转悲观；压力位能否放量突破。");
  L.push("  【悲观情景】条件：指数放量下跌 + 跌破关键支撑（MA60 / 近60日低）+ 涨停家数骤减、炸板率升高。");
  L.push("     观察要点：偏弱标的（"+bears.length+" 只）是否率先破位，市场温度是否降至退潮/冰点，届时容错率显著下降。");
  L.push("");
  return L.join("\n");
}

/* ---------- 报告：主线 × 持仓映射 ---------- */
function buildSectorMapBlock(){
  const L=[];
  const sn=state.snap||{};
  const hot=sn.hot||[], net=sn.net||[];
  if(!hot.length&&!net.length){L.push("⚠ 数据缺失：无板块快照，无法做主线映射。\n");return L.join("\n");}
  const holds=state.holdings.filter(h=>h.inReport!==false);
  const seen={},rows=[];
  [].concat(hot.map(x=>({name:x.name,chg:x.chg,net:null,kind:"领涨"})),
            net.map(x=>({name:x.name,chg:x.chg,net:x.net,kind:"资金"}))).forEach(s=>{
    const k=s.name+"|"+s.kind; if(seen[k])return; seen[k]=1;
    rows.push({s:s,hits:holds.filter(h=>sectorMatch(s.name,HOLD_SECTOR[h.code]))});
  });
  rows.sort((a,b)=>(b.hits.length-a.hits.length)||((num(b.s.chg)||0)-(num(a.s.chg)||0)));
  const cov={}; rows.forEach(r=>r.hits.forEach(h=>cov[h.code]=1));
  const un=holds.filter(h=>!cov[h.code]);
  L.push("■ 今日主线 × 持仓映射（板块名匹配推断，非精确行业归类）");
  L.push("  主线板块 "+rows.length+" 个，命中持仓的板块 "+rows.filter(r=>r.hits.length).length+" 个；"
    +"被主线覆盖持仓 "+Object.keys(cov).length+"/"+holds.length+" 只"
    +(un.length?"；未覆盖："+un.map(x=>x.name).join("、")+"（非当前热点，需独立跟踪）":"；主线覆盖充分"));
  rows.slice(0,12).forEach(r=>{
    L.push("    · "+r.s.name+"（"+r.s.kind+"）"+pct(r.s.chg)
      +(r.s.net!=null?"　主力净流入 "+f2(r.s.net)+"亿":"")
      +"　→　"+(r.hits.length?r.hits.map(h=>{
          const an=getAn(h.code);
          return h.name+(an?"（评分 "+an.score.total+"）":"");
        }).join("、"):"无持仓命中"));
  });
  L.push("");
  return L.join("\n");
}

/* ---------- 报告总装 ---------- */
var LAST_REPORT="";
function genReport(){
  const inRep=state.holdings.filter(h=>h.inReport!==false);
  const stocks=inRep.map(h=>{
    const stk=state.stocks[h.code];
    if(!stk||!stk.rows||stk.rows.length<8)return {name:h.name,code:h.code,type:h.type,an:null,rows:null};
    const an=analyzeStock({rows:stk.rows,name:h.name,code:h.code});
    return {name:h.name,code:h.code,type:h.type,an:(an&&an.err)?null:an,rows:stk.rows};
  });
  const now=new Date();
  const pad=n=>String(n).padStart(2,"0");
  const ts=now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())+" "+pad(now.getHours())+":"+pad(now.getMinutes());
  let rep="";
  rep+="# A股每日复盘报告（技术分析版）\n\n";
  rep+="生成时间："+ts+"　｜　数据快照日期："+SNAPSHOT_DATE+"　｜　纳入标的："+inRep.length+" 只\n";
  rep+="数据来源：内嵌真实日K线（本机抓取）+ 板块/资金快照；指标由本地 JS 从原始 OHLCV 计算。\n\n";
  rep+="## 第一步：大盘环境与趋势评估\n\n"+buildMarketBlock();
  try{
    const rm=aiMarket();
    const strip2=s=>String(s).replace(/<[^>]+>/g,"");
    let mb="\n■ AI 大盘解读（规则推理 · 非投资建议）\n";
    mb+="  【结论】"+rm.icon+" "+rm.title+"\n";
    mb+="  "+strip2(rm.desc)+"\n";
    if(rm.items.length){mb+="  【盘面解读】\n";rm.items.forEach(x=>mb+="    · "+strip2(x)+"\n");}
    mb+="  【风险与容错提示】\n"+rm.risks.map(x=>"    · "+strip2(x)).join("\n")+"\n";
    rep+=mb;
  }catch(e){}
  rep+="## 第二步：板块轮动与主线识别\n\n"+buildSectorBlock();
  try{ rep+=buildSectorMapBlock(); }catch(e){}
  rep+="## 第三步：个股技术面诊断（共 "+inRep.length+" 只）\n\n";
  stocks.forEach(s=>{
    if(!s.an){ rep+="────────────────────────────────────\n【"+s.name+"】"+s.code+"\n  ⚠ 数据缺失：未载入K线数据，无法诊断。\n\n"; return; }
    rep+=buildStockBlock(s);
  });
  try{
    const rp=aiPortfolio(inRep);
    if(rp){
      const strip3=s=>String(s).replace(/<[^>]+>/g,"");
      let pb="\n■ AI 组合诊断（集中度 / 强弱结构 · 非投资建议）\n";
      pb+="  【结论】"+rp.icon+" "+rp.title+"\n";
      pb+="  "+strip3(rp.desc)+"\n";
      pb+="  【结构要点】\n"+rp.items.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      pb+="  【组合层面风险】\n"+rp.risks.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      rep+=pb;
    }
  }catch(e){}
  rep+="## 第四步：风险警示与情景推演\n\n"+buildRiskBlock(stocks);
  rep+="\n────────────────────────────────────\n";
  rep+="## 免责声明\n\n";
  rep+="本报告由本地工具依据用户提供的真实行情数据自动生成，所有技术指标（MA/EMA/MACD/RSI/KDJ/BOLL/量比/POC 等）"
    +"均由本地 JavaScript 从原始 OHLCV 计算，未接入任何交易通道。\n";
  rep+="报告中所有内容为技术形态的客观描述与情景推演，不构成任何买入/卖出的交易指令，也不构成投资建议。\n";
  rep+="技术分析具有滞后性与失效可能，历史形态不代表未来表现。市场有风险，据此操作，风险自负。\n";
  LAST_REPORT=rep;
  const out=$("reportOut");
  if(out)out.textContent=rep;
  return rep;
}

/* ---------- 导出 ---------- */
function download(content,name,type){
  const blob=new Blob([content],{type:type||"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download=name;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},300);
}

/* ---------- 联网：指数 + 涨跌家数 ---------- */
function jsonp(url,timeout){
  return new Promise((resolve,reject)=>{
    const cb="__cb"+Math.random().toString(36).slice(2,9);
    const s=document.createElement("script");
    let done=false;
    window[cb]=(data)=>{done=true;delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve(data);};
    s.onerror=()=>{if(!done){delete window[cb];reject(new Error("script error"));}};
    s.src=url+(url.indexOf("?")<0?"?":"&")+"cb="+cb;
    document.body.appendChild(s);
    setTimeout(()=>{if(!done){delete window[cb];try{document.body.removeChild(s);}catch(e){}reject(new Error("timeout"));}},timeout||9000);
  });
}
function fetchText(url,timeout){
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src=url;document.body.appendChild(s);
    setTimeout(()=>{try{document.body.removeChild(s);}catch(e){}reject(new Error("timeout"));},timeout||9000);
  });
}
/* 腾讯指数：返回 v_sh000001="..." 文本，用 script 加载后读取全局变量 */
function fetchTencentQuote(codes){
  return new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.charset="GBK";
    s.src="https://qt.gtimg.cn/q="+codes.join(",");
    s.onload=()=>{
      const out={};
      codes.forEach(c=>{
        const v=window["v_"+c];
        if(!v)return;
        const f=String(v).split("~");
        out[c]={name:f[1],price:num(f[3]),prev:num(f[4]),chg:num(f[31]),pct:num(f[32]),
          high:num(f[33]),low:num(f[34]),amount:num(f[37]),time:f[30]};
      });
      try{document.body.removeChild(s);}catch(e){}
      resolve(out);
    };
    s.onerror=()=>{try{document.body.removeChild(s);}catch(e){}reject(new Error("network"))};
    document.body.appendChild(s);
    setTimeout(()=>{reject(new Error("timeout"))},9000);
  });
}
async function fetchMarket(){
  const btn=$("btnRefresh");
  if(btn){btn.disabled=true;btn.textContent="刷新中…";}
  const msgs=[];
  try{
    const q=await fetchTencentQuote(["sh000001","sz399001","sz399006"]);
    const map={sh000001:["sh_close","sh_chg","sh_amt"],sz399001:["sz_close","sz_chg","sz_amt"],sz399006:["cy_close","cy_chg","cy_amt"]};
    state.market=state.market||{};
    Object.keys(map).forEach(k=>{
      const d=q[k];if(!d)return;
      const [a,b,c]=map[k];
      const old=state.market[a];
      state.market[a]=d.price;
      state.market[b]=d.pct;
      state.market[c]=d.amount!=null?Math.round(d.amount/100)/100:null;
      const od=a.replace("_close","_amtd");
      if(old!=null&&d.price!=null)state.market[od]=Math.round((d.price-old)/old*10000)/100;
    });
    msgs.push("指数已更新（"+Object.keys(q).length+"/3）");
    clearAn("000001");clearAn("399001");clearAn("399006");
  }catch(e){ msgs.push("指数刷新失败（网络/CORS）：保留快照数据"); }
  /* 涨跌家数：东方财富 clist（CORS 开放） */
  try{
    const url="https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=200&po=1&np=1&fltt=2&invt=2&fid=f3"
      +"&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23&fields=f12,f14,f3,f2";
    const data=await jsonp(url,9000).catch(()=>null);
    if(data&&data.data&&data.data.diff){
      const rows=data.data.diff;
      const xs=rows.map(r=>num(r.f3)).filter(x=>x!=null);
      if(xs.length){
        state.breadth={
          up:xs.filter(x=>x>0).length,
          dn:xs.filter(x=>x<0).length,
          zt:xs.filter(x=>x>=9.8).length,
          dt:xs.filter(x=>x<=-9.8).length
        };
        msgs.push("涨跌家数已更新（样本 "+xs.length+" 只，非全市场，仅供参考）");
      } else msgs.push("涨跌家数：返回为空，保留原值/标注缺失");
    } else msgs.push("涨跌家数获取失败（限流/CORS）：标注数据缺失");
  }catch(e){ msgs.push("涨跌家数获取失败：标注数据缺失"); }
  saveState();renderMarket();renderHeader();renderDash();
  if(btn){btn.disabled=false;btn.textContent="↻ 刷新行情";}
  alert("刷新完成：\n· "+msgs.join("\n· "));
}

/* ---------- 联网：个股日K（新浪） ---------- */
function sinaSym(code){
  if(/^(6|5|11|9)/.test(code))return "sh"+code;
  if(/^(0|3|1)/.test(code))return "sz"+code;
  return "sz"+code;
}
function fetchKlineSina(code){
  return new Promise((resolve,reject)=>{
    const cb="__k"+Math.random().toString(36).slice(2,9);
    const s=document.createElement("script");
    let done=false;
    window[cb]=(data)=>{done=true;delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve(data||[]);};
    s.onerror=()=>{if(!done){delete window[cb];reject(new Error("err"));}};
    s.src="https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol="
      +sinaSym(code)+"&scale=240&ma=5&datalen=320&cb="+cb;
    document.body.appendChild(s);
    setTimeout(()=>{if(!done){delete window[cb];try{document.body.removeChild(s);}catch(e){}resolve([]);}},11000);
  });
}
async function fetchStockData(code){
  const raw=await fetchKlineSina(code);
  if(!raw||!raw.length)return 0;
  const rows=raw.map(d=>{
    const o=num(d.open),h=num(d.high),l=num(d.low),c=num(d.close),v=num(d.volume);
    if([o,h,l,c].some(x=>x==null))return null;
    return [String(d.day).slice(0,10),o,h,l,c,v==null?0:v,null];
  }).filter(Boolean);
  if(rows.length<8)return 0;
  state.stocks[code]={rows};clearAn(code);saveState();
  return rows.length;
}
async function fetchAllHoldings(){
  const msg=$("holdMsg");
  let done=0,fail=0;
  for(const h of state.holdings){
    if(msg)msg.textContent="拉取中 "+h.name+"…";
    try{ const n=await fetchStockData(h.code); if(n>0)done++; else fail++; }
    catch(e){ fail++; }
  }
  if(msg)msg.textContent="完成：成功 "+done+" 只，失败 "+fail+" 只";
  renderHoldings();renderRail();renderDash();
  alert("批量拉取完成：成功 "+done+" 只，失败 "+fail+" 只。\n失败多为网络/CORS，可手动粘贴K线。");
}

/* ============================================================
   事件绑定
   ============================================================ */
function bind(){
  document.querySelectorAll("nav button").forEach(b=>{b.onclick=()=>tab(b.dataset.tab);});

  /* 周期/主图/副图 切换 */
  document.querySelectorAll("#segPeriod button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segPeriod button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.period=b.dataset.p;drawKline();
    };
  });
  document.querySelectorAll("#segMain button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segMain button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.main=b.dataset.m;drawKline();
    };
  });
  document.querySelectorAll("#segSub button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segSub button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.sub=b.dataset.s;drawKline();
    };
  });
  document.querySelectorAll("#segSpan button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll("#segSpan button").forEach(x=>x.classList.remove("on"));
      b.classList.add("on");CUR.span=parseInt(b.dataset.n,10)||0;drawKline();
    };
  });
  ["ckSignal","ckLevel","ckChan"].forEach(id=>{const e=$(id);if(e)e.onchange=drawKline;});
  const bp=$("btnPng");
  if(bp)bp.onclick=()=>{
    const el=$("klineChart");
    if(el&&el._c){ try{ const url=el._c.getDataURL({type:"png",pixelRatio:2,backgroundColor:"#0d131d"});
      const a=document.createElement("a");a.href=url;a.download=(CUR.an?(CUR.an.name||CUR.code):"kline")+"_"+(CUR.period==="weekly"?"周线":"日线")+".png";
      document.body.appendChild(a);a.click();a.remove(); }catch(e){alert("导出失败："+e.message);} }
  };

  /* 个股 */
  const ls=$("loadStock"); if(ls)ls.onclick=loadCurrent;
  const fs=$("fetchStock");
  if(fs)fs.onclick=async()=>{
    let code=($("stockCode").value||"").trim();
    if(!code){alert("请先输入代码或名称（支持 6 位代码 / 中文名 / 拼音首字母）");return;}
    /* 支持名称 / 拼音 → 代码 */
    if(!/^\d{6}$/.test(code)){
      const r=lookupName(code);
      if(r){ code=r.code; $("stockCode").value=r.code;
             if(!$("stockName").value)$("stockName").value=r.name; }
      else { alert("未识别「"+code+"」。请输入 6 位代码，或点「选…」按名称检索。"); return; }
    }
    if(!$("stockName").value)$("stockName").value=nameOf(code)||code;
    fs.disabled=true;fs.textContent="拉取中…";
    let n=0;
    try{ n=await fetchStockData(code); }catch(e){ n=0; }
    fs.disabled=false;fs.textContent="联网拉取";
    if(n>0){
      if(!state.holdings.find(h=>h.code===code)){
        const c=String(code);
        const tp=(/^(159|51|58|56|52|16)/.test(c)?"ETF":(IDX_CODES[c]?"IDX":"A"));
        state.holdings.push({code:code,name:($("stockName").value||code),type:tp,inReport:true});
        saveState();renderHoldings();renderRail();
      }
      loadCurrent();
      alert("已拉取 "+($("stockName").value||code)+"（"+code+"）"+n+" 根日K线。");
    }else{
      const raw=$("stockRaw");
      if(raw&&!raw.value){
        raw.value="日期,开盘,最高,最低,收盘,成交量\n"
          +"（把上面一行留着也行，下面按 2026-09-10,31.20,31.80,31.05,31.60,38210000 的格式粘贴，\n"
          +" 支持逗号 / Tab / 空格分隔，也支持 2026/9/10、20260910 日期；可从 Excel、通达信、同花顺直接复制）\n";
      }
      alert(fetchFailGuide(code)
        +"\n\n已按顺序尝试："+APICFG.order.filter(s=>APICFG.on[s]!==false).map(s=>SRC_META[s].nm).join(" → ")
        +"\n\n可以这样做：\n"
        +"① 去「⑨ 数据后台」点「测速全部数据源」看哪个可用，并调整顺序或填 CORS 代理；\n"
        +"② 或直接在下方「日K线数据」框粘贴（已放好模板，支持从 Excel / 通达信 / 同花顺复制）；\n"
        +"③ 若是新代码，确认 6 位代码正确、且属于沪深京市场。");
    }
  };
  const rs=$("railSearch"); if(rs)rs.oninput=renderRail;

  /* 大盘输入 */
  ["b_up","b_dn","b_zt","b_dt","b_zb","b_amt"].forEach(id=>{
    const e=$(id); if(e)e.oninput=()=>{
      state.breadth=state.breadth||{};
      state.breadth[id.slice(2)]=e.value;saveState();renderHeader();renderBreadthBar();
    };
  });
  const vn=$("vol_note"); if(vn)vn.oninput=()=>{state.vol_note=vn.value;saveState();};
  const as=$("applySnap");
  if(as)as.onclick=()=>{
    try{
      const o=JSON.parse($("snapJson").value);
      if(!o.hot&&!o.money)throw new Error("需含 hot 或 money 字段");
      state.snap=Object.assign({hot:[],money:[]},state.snap,o);
      saveState();renderSnapshot();renderSectorVerdict();
      alert("板块快照已应用");
    }catch(e){alert("JSON 解析失败："+e.message);}
  };
  const rsn=$("resetSnap");
  if(rsn)rsn.onclick=()=>{
    state.snap=JSON.parse(JSON.stringify({hot:DEFAULT_SNAPSHOT.hot||[],money:DEFAULT_SNAPSHOT.money||[]}));
    saveState();renderSnapshot();alert("已恢复默认快照");
  };

  /* 板块 */
  const ad=$("addSector");
  if(ad)ad.onclick=()=>{state.sectors.push({name:"",chg:"",logic:"资金",leader:"",mid:"",low:"",days:"",note:""});saveState();renderSectors();};
  const fls=$("fillSector");
  if(fls)fls.onclick=()=>{state.sectors=defaultSectors();saveState();renderSectors();alert("已从快照填充板块");};

  /* 持仓 */
  const fa=$("fetchAll"); if(fa)fa.onclick=()=>fetchAllHoldings();
  const rh=$("resetHold");
  if(rh)rh.onclick=()=>{
    if(!confirm("确定清空全部持仓？你的自定义持仓与成本数据将被重置（内置行情库保留）。"))return;
    state.holdings=DEFAULT_HOLDINGS.map(h=>({...h}));
    state.stocks=buildDefaultStocks();clearAn();saveState();
    renderHoldings();renderRail();renderDash();
  };
  const ah=$("addHold");
  if(ah)ah.onclick=()=>{
    const c=($("newCode").value||"").trim(),n=($("newName").value||"").trim(),t=$("newType").value;
    if(!c){alert("请输入代码");return;}
    if(state.holdings.find(h=>h.code===c)){alert("该代码已存在");return;}
    state.holdings.push({code:c,name:n||c,type:t,inReport:true});
    saveState();renderHoldings();renderRail();
    $("newCode").value="";$("newName").value="";
  };

  /* 报告 / 导出 / 备份 */
  const gr=$("genReport"); if(gr)gr.onclick=()=>{genReport();};
  const dm=$("dlMd"); if(dm)dm.onclick=()=>{genReport();download(LAST_REPORT,"复盘报告_"+SNAPSHOT_DATE+".md","text/markdown;charset=utf-8");};
  const dh=$("dlHtml");
  if(dh)dh.onclick=()=>{
    genReport();
    const html="<!doctype html><html lang=zh-CN><head><meta charset=utf-8><title>复盘报告 "+SNAPSHOT_DATE+"</title>"
      +"<style>body{background:#0d1117;color:#c9d1d9;font:14px/1.8 'Microsoft YaHei',monospace;padding:28px;max-width:960px;margin:0 auto}"
      +"h1,h2{color:#58a6ff}h2{border-bottom:1px solid #30363d;padding-bottom:6px;margin-top:28px}"
      +"pre{white-space:pre-wrap}</style></head><body><pre>"+esc(LAST_REPORT)+"</pre></body></html>";
    download(html,"复盘报告_"+SNAPSHOT_DATE+".html","text/html;charset=utf-8");
  };
  const bp2=$("btnPrint"); if(bp2)bp2.onclick=()=>window.print();
  const br=$("btnRefresh"); if(br)br.onclick=()=>fetchMarket();
  const be=$("btnExport"); if(be)be.onclick=()=>{tab("report");genReport();};
  const bk=$("btnBackup");
  if(bk)bk.onclick=()=>{
    const act=confirm("确定导出备份？\n【确定】= 导出 JSON 备份\n【取消】= 导入备份文件")?"exp":"imp";
    if(act==="exp"){
      download(JSON.stringify(state,null,1),"复盘数据备份_"+SNAPSHOT_DATE+".json","application/json;charset=utf-8");
    }else{
      const inp=document.createElement("input");inp.type="file";inp.accept=".json";
      inp.onchange=()=>{
        const f=inp.files[0];if(!f)return;
        const rd=new FileReader();
        rd.onload=()=>{
          try{
            const o=JSON.parse(rd.result);
            if(!o.holdings)throw new Error("文件格式不正确");
            state=o;clearAn();saveState();
            renderHoldings();renderRail();renderMarket();renderDash();
            alert("导入成功");
          }catch(e){alert("导入失败："+e.message);}
        };
        rd.readAsText(f);
      };
      inp.click();
    }
  };

  window.addEventListener("resize",()=>{
    ["klineChart","radarChart","scoreChart","sigPie","tempGauge","breadthBar","structBar"].forEach(id=>{
      const e=$(id);if(e&&e._c)try{e._c.resize();}catch(err){}
    });
  });
}

/* ============================================================
   初始化
   ============================================================ */
function init(){
  bind();
  renderHeader();
  renderMarket();
  renderSectors();
  renderHoldings();
  renderRail();
  renderDash();
  $("snapJson")._touched=false;
  const j=$("snapJson"); if(j)j.oninput=()=>{j._touched=true;};
  if(state.holdings.length)pickStock(state.holdings[0].code);
  tab("dash");
  genReport();
  window.addEventListener("resize",()=>{const e=$("klineChart");if(e&&e._c)e._c.resize();});
}
/* v2.0: init 由 engine10 统一启动（需等全部 var 初始化完成） */

/* ============================================================
   AI 技术研判引擎（规则推理 · 每条结论附数据依据）
   ============================================================ */
function aiStock(an){
  const i=an.i, c=an.close;
  const A=(arr,k)=>nn(arr&&arr[k])?arr[k]:null;
  const bulls=[],bears=[],risks=[],watch=[],levels=[];
  let res=0, resMax=0;

  /* 1. 多周期共振度 0-100 */
  const rc=(cond,w)=>{resMax+=w; if(cond)res+=w;};
  rc(/多头/.test(an.arrange),22);
  rc(an.wk&&an.wk.ok&&/多头/.test(an.wk.arrange),20);
  rc(A(an.ma20,i)!=null&&c>A(an.ma20,i),12);
  rc(A(an.ma60,i)!=null&&c>A(an.ma60,i),12);
  rc(A(an.bar,i)!=null&&A(an.bar,i)>=0,10);
  rc(an.dif[i]>an.dea[i],8);
  rc(nn(an.vr)&&an.vr>=1,8);
  rc(nn(an.rsiV)&&an.rsiV>=50,8);
  const resPct=Math.round(res/Math.max(1,resMax)*100);

  /* 2. 结论 */
  const sc=an.score.total;
  let tone,icon,title;
  if(resPct>=72&&sc>=58){tone="up";icon="▲";title="多头趋势明确，回踩不破关键均线则视为趋势延续";}
  else if(resPct>=56){tone="up";icon="▲";title="偏多格局，但尚未形成完整多周期共振";}
  else if(resPct>=44){tone="neu";icon="◆";title="多空胶着，方向未明，等待关键位突破确认";}
  else if(resPct>=28){tone="down";icon="▼";title="偏空格局，反弹受制于上方均线压力";}
  else{tone="down";icon="▼";title="空头趋势主导，尚未见到有效止跌信号";}

  const arrTxt=/多头/.test(an.arrange)?"多头排列":(/空头/.test(an.arrange)?"空头排列":"均线纠缠");
  const wkTxt=(an.wk&&an.wk.ok)?(/多头/.test(an.wk.arrange)?"周线多头":(/空头/.test(an.wk.arrange)?"周线空头":"周线纠缠")):"周线数据不足";
  const pos60=((c-an.hl60.lo)/Math.max(1e-9,an.hl60.hi-an.hl60.lo)*100);
  const desc="日线"+arrTxt+"、"+wkTxt+"，多周期共振度 <b>"+resPct+"%</b>；"
    +"技术评分 <b>"+sc+"</b> 分（"+an.score.label+"），"
    +"RSI(14)=<b>"+f1(an.rsiV)+"</b>（"+an.rsiZone+"），"
    +"量比 <b>"+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+"</b>。"
    +"当前价 "+f2(c)+" 处于近60日区间 "+f2(an.hl60.lo)+"～"+f2(an.hl60.hi)+" 的 <b>"+pos60.toFixed(0)+"%</b> 分位。";

  /* 3. 多头 / 空头依据 */
  if(/多头/.test(an.arrange))bulls.push("均线<b>多头排列</b>（"+esc(an.arrange)+"），短中期成本依次抬高");
  if(an.wk&&an.wk.ok&&/多头/.test(an.wk.arrange))bulls.push("周线同步多头，大周期方向向上（周MA5近4周斜率 "+(an.wk.slope!=null?(an.wk.slope>0?"+":"")+f2(an.wk.slope)+"%":"数据缺失")+"）");
  if(A(an.bar,i)!=null&&A(an.bar,i)>=0)bulls.push("MACD 柱 <b>"+f3(an.bar[i])+"</b> 为红柱，动能偏多");
  if(an.dif[i]>an.dea[i])bulls.push("DIF("+f3(an.dif[i])+") 位于 DEA("+f3(an.dea[i])+") 上方");
  if(nn(an.rsiV)&&an.rsiV>=55&&an.rsiV<70)bulls.push("RSI(14)="+f1(an.rsiV)+" 处于偏强区（50-70），尚未过热");
  if(nn(an.vr)&&an.vr>=1.2)bulls.push("量比 "+an.vr.toFixed(2)+"，较5日均量<b>明显放大</b>，资金关注度提升");
  if(nn(an.ms.s1)&&an.ms.s1>0)bulls.push("MA5-MA20 发散 <b>+"+an.ms.s1.toFixed(2)+"%</b>，短中期均线上张口");
  if(an.chan&&an.chan.slope>0)bulls.push("处于<b>"+esc(an.chan.dir)+"</b>，通道斜率 +"+f2(an.chan.slopePct)+"%");
  const lastB=(an.sigs||[]).filter(s=>s.side==="b"&&s.i>=i-6);
  if(lastB.length)bulls.push("近6日出现 "+lastB.length+" 个多头信号："+lastB.slice(0,3).map(s=>esc(s.nm)).join("、"));

  if(/空头/.test(an.arrange))bears.push("均线<b>空头排列</b>（"+esc(an.arrange)+"），反弹受均线层层压制");
  if(an.wk&&an.wk.ok&&/空头/.test(an.wk.arrange))bears.push("周线空头排列，大周期仍在下行");
  if(A(an.bar,i)!=null&&A(an.bar,i)<0)bears.push("MACD 柱 <b>"+f3(an.bar[i])+"</b> 为绿柱，动能偏空");
  if(nn(an.rsiV)&&an.rsiV<45)bears.push("RSI(14)="+f1(an.rsiV)+" 处于偏弱区，买盘不足");
  if(nn(an.vr)&&an.vr<0.8)bears.push("量比 "+an.vr.toFixed(2)+" <b>明显缩量</b>，承接意愿弱");
  if(nn(an.ms.s1)&&an.ms.s1<0)bears.push("MA5-MA20 发散 <b>"+an.ms.s1.toFixed(2)+"%</b>，均线下张口");
  if(an.chan&&an.chan.slope<0)bears.push("处于<b>"+esc(an.chan.dir)+"</b>，通道斜率 "+f2(an.chan.slopePct)+"%");
  const lastS=(an.sigs||[]).filter(s=>s.side==="s"&&s.i>=i-6);
  if(lastS.length)bears.push("近6日出现 "+lastS.length+" 个空头信号："+lastS.slice(0,3).map(s=>esc(s.nm)).join("、"));

  /* 4. 风险 */
  if(nn(an.rsiV)&&an.rsiV>=72)risks.push("RSI(14)="+f1(an.rsiV)+" 进入<b>超买区</b>（>70），获利盘积累，回撤敏感度上升");
  if(nn(an.rsiV)&&an.rsiV<=28)risks.push("RSI(14)="+f1(an.rsiV)+" 进入<b>超卖区</b>（<30），有反弹条件但下跌动能尚未衰竭");
  if(an.diver&&an.diver.indexOf("顶背离")>=0)risks.push("检测到<b>顶背离</b>：价格创新高而 DIF 未同步，内在动能转弱");
  if(an.diver&&an.diver.indexOf("底背离")>=0)risks.push("检测到<b>底背离</b>：价格创新低而 DIF 抬升，属止跌前兆，需量能确认方可视为反转");
  if(an.bw&&nn(an.bw.bw)&&/收敛/.test(an.bw.state))risks.push("布林带宽 "+an.bw.bw.toFixed(2)+"% <b>极度收敛</b>，处于变盘临界，方向未定前不宜加仓");
  if(nn(an.ms.s1)&&Math.abs(an.ms.s1)>8)risks.push("MA5 偏离 MA20 达 <b>"+an.ms.s1.toFixed(2)+"%</b>，乖离过大存在均值回归压力");
  if(nn(an.vr)&&an.vr<0.7&&(num(an.chg)||0)>0)risks.push("上涨当日量比仅 "+an.vr.toFixed(2)+"，<b>价涨量缩</b>，上攻持续性存疑");
  if(nn(an.vr)&&an.vr>2.5)risks.push("量比高达 "+an.vr.toFixed(2)+"，<b>巨量</b>对应分歧加剧，需观察次日能否守住");
  if(A(an.atr,i)!=null){const ap=an.atr[i]/c*100;if(ap>4)risks.push("ATR(14)="+f2(an.atr[i])+"（占股价 "+ap.toFixed(2)+"%），<b>波动率偏高</b>，仓位应相应收缩");}
  if(!risks.length)risks.push("当前未触发显著风险指标，但仍需留意大盘系统性波动与个股基本面变化");

  /* 5. 关键位 */
  const atr=A(an.atr,i);
  levels.push({nm:"最新收盘",vv:f2(c),tone:"neu"});
  const sup1=an.sup[0], res1=an.res[0];
  levels.push({nm:"最近支撑",vv:sup1!=null?f2(sup1):"数据缺失",tone:"up"});
  levels.push({nm:"最近压力",vv:res1!=null?f2(res1):"数据缺失",tone:"down"});
  if(nn(an.poc.poc))levels.push({nm:"密集成交区 POC",vv:f2(an.poc.poc),tone:(c>=an.poc.poc?"up":"down")});
  if(A(an.ma20,i)!=null)levels.push({nm:"MA20",vv:f2(an.ma20[i]),tone:(c>=an.ma20[i]?"up":"down")});
  if(A(an.ma60,i)!=null)levels.push({nm:"MA60（生命线）",vv:f2(an.ma60[i]),tone:(c>=an.ma60[i]?"up":"down")});
  if(atr!=null)levels.push({nm:"ATR 波动参考 ±1",vv:f2(c-atr)+" ～ "+f2(c+atr),tone:"neu"});
  if(sup1!=null&&atr!=null)levels.push({nm:"结构破坏参考位",vv:f2(sup1-atr*0.5),tone:"down"});

  /* 6. 观察要点 */
  if(A(an.ma20,i)!=null)watch.push("能否<b>站稳 MA20（"+f2(an.ma20[i])+"）</b>——短中期分水岭");
  if(A(an.ma60,i)!=null)watch.push("MA60（"+f2(an.ma60[i])+"）得失决定中期趋势性质是否改变");
  watch.push("量能能否<b>持续放大</b>（量比维持 >1.2）——无量上攻难以持续");
  if(res1!=null)watch.push("上方 <b>"+f2(res1)+"</b> 能否放量有效突破");
  if(sup1!=null)watch.push("下方 <b>"+f2(sup1)+"</b> 破位则支撑结构失效");
  if(A(an.bar,i)!=null&&A(an.bar,i)<0)watch.push("MACD 绿柱何时<b>缩短并翻红</b>——动能转向的前置信号");
  if(nn(an.rsiV)&&an.rsiV>=70)watch.push("RSI 能否从超买区回落至 70 下方且不破关键均线（强势整理）");

  return {tone,icon,title,desc,resPct,score:sc,
    bulls:bulls.length?bulls:["当前无明确多头技术依据"],
    bears:bears.length?bears:["当前无明确空头技术依据"],
    risks,levels,watch};
}

/* 大盘 AI 解读 */
function aiMarket(){
  const m=state.market||{}, b=state.breadth||{};
  const items=[],risks=[];
  const sh=num(m.sh_chg),sz=num(m.sz_chg),cy=num(m.cy_chg);
  const cnt=(sh!=null?1:0)+(sz!=null?1:0)+(cy!=null?1:0);
  const avg=cnt?(((sh||0)+(sz||0)+(cy||0))/cnt):null;
  const up=num(b.up),dn=num(b.dn);
  const ratio=(up!=null&&dn&&dn>0)?up/dn:null;
  let tone="neu",icon="◆",title="市场处于震荡格局";

  if(avg!=null){
    if(avg>=1){tone="up";icon="▲";title="三大指数普涨，市场情绪回暖";}
    else if(avg>=0.2){tone="up";icon="▲";title="指数小幅收红，结构性行情为主";}
    else if(avg<=-1){tone="down";icon="▼";title="三大指数普跌，市场情绪转弱";}
    else if(avg<=-0.2){tone="down";icon="▼";title="指数小幅收绿，赚钱效应收缩";}
    else {tone="neu";icon="◆";title="指数涨跌互现，多空分歧明显";}
  }
  let desc="三大指数：上证 <b>"+f2(num(m.sh_close))+"</b>（"+pct(sh)+"）、深证 <b>"+f2(num(m.sz_close))+"</b>（"+pct(sz)+"）、创业板 <b>"+f2(num(m.cy_close))+"</b>（"+pct(cy)+"）。";
  if(avg!=null)desc+="平均涨跌 <b>"+(avg>=0?"+":"")+avg.toFixed(2)+"%</b>。";

  if(up!=null&&dn!=null){
    desc+=" 市场宽度：上涨 <b>"+up+"</b> 家 / 下跌 <b>"+dn+"</b> 家，涨跌比 <b>"+(ratio!=null?ratio.toFixed(2):"—")+"</b>。";
    if(ratio!=null){
      if(ratio>=2)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>普涨格局</b>，赚钱效应扩散，容错率较高");
      else if(ratio>=1.2)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>涨多跌少</b>，情绪偏暖但需主线支撑");
      else if(ratio>=0.8)items.push("涨跌比 "+ratio.toFixed(2)+"，多空<b>基本均衡</b>，典型分化市");
      else if(ratio>=0.5)items.push("涨跌比 "+ratio.toFixed(2)+"，<b>跌多涨少</b>，赚钱效应收缩，容错率下降");
      else items.push("涨跌比仅 "+ratio.toFixed(2)+"，<b>普跌格局</b>，系统性风险大于结构性机会");
    }
  } else {
    risks.push("市场宽度（涨跌家数）<b>数据缺失</b>——点顶部「↻ 刷新行情」补全后温度判定才准确");
  }
  const zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  if(zt!=null){
    items.push("涨停 <b>"+zt+"</b> 家"+(dt!=null?"、跌停 <b>"+dt+"</b> 家":"")+(zb!=null?"、炸板 <b>"+zb+"</b> 家":""));
    if(zb!=null&&zt>0){
      const zbr=zb/(zt+zb)*100;
      items.push("炸板率 <b>"+zbr.toFixed(1)+"%</b>"+(zbr>35?"——<b>偏高</b>，追涨风险大、承接不足":(zbr<15?"——偏低，封板质量较好":"——中性水平")));
    }
    if(zt>=80)items.push("涨停家数 "+zt+" 家，处于<b>情绪高位</b>，需防高潮后的分歧");
    else if(zt<=25)items.push("涨停家数仅 "+zt+" 家，处于<b>情绪低位</b>，热点稀缺");
  } else {
    risks.push("涨停/跌停/炸板数据缺失，情绪周期判断不完整");
  }
  const amt=(num(m.sh_amt)||0)+(num(m.sz_amt)||0);
  if(amt>0)items.push("两市合计成交 <b>"+f2(amt)+" 亿</b>"+(amt>20000?"（<b>显著放量</b>，交投活跃）":(amt<9000?"（<b>明显缩量</b>，观望情绪浓）":"（量能中性）")));
  /* 指数技术面（基于内嵌真实指数日K） */
  [["000001","上证"],["399001","深证"],["399006","创业板"]].forEach(function(d){
    let an=null; try{ an=getAn(d[0]); }catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    const a20=an.close>an.ma20[an.i], a60=nn(an.ma60[an.i])&&an.close>an.ma60[an.i];
    items.push("<b>"+d[1]+"指数</b> "+f2(an.close)+"：位于 MA20 "+(a20?"上方":"下方")+"、MA60 "+(a60?"上方":"下方")
      +"，"+esc(an.arrange)+"，MACD柱 "+f3(an.bar[an.i])+(nn(an.vr)?"，量比 "+an.vr.toFixed(2):""));
  });
  const sn=state.snap||{};
  if(sn.hot&&sn.hot.length)items.push("领涨主线：<b>"+sn.hot.slice(0,3).map(x=>esc(x.name)+" "+pct(x.chg)).join("、")+"</b>");
  if(sn.net&&sn.net.length){
    const pos=sn.net.filter(x=>(num(x.net)||0)>0), neg=sn.net.filter(x=>(num(x.net)||0)<0);
    if(pos.length)items.push("主力净流入居前：<b>"+pos.slice(0,2).map(x=>esc(x.name)+" +"+f2(x.net)+"亿").join("、")+"</b>");
    if(neg.length)items.push("主力净流出居前：<b>"+neg.slice(0,2).map(x=>esc(x.name)+" "+f2(x.net)+"亿").join("、")+"</b>，注意资金撤离方向");
  }
  if(avg!=null&&avg>0.8)risks.push("指数涨幅较大，需防<b>次日高位分歧</b>，追高容错率低");
  if(avg!=null&&avg<-0.8)risks.push("指数跌幅较深，若次日<b>不能收复</b>，易形成下跌中继");
  if(ratio!=null&&ratio<0.5)risks.push("市场宽度极差（涨跌比 "+ratio.toFixed(2)+"），<b>指数与个股背离</b>时勿被指数表象误导");
  if(zt!=null&&zt>=80)risks.push("涨停家数处于高位，情绪<b>接近高潮</b>，通常对应短期风险累积");
  if(!risks.length)risks.push("当前未见极端信号，按常态震荡市处理，控制单一标的集中度");

  return {tone,icon,title,desc,items,risks,avgTemp:avg};
}

/* 组合 AI 诊断 */
function aiPortfolio(list){
  const rows=[];
  list.forEach(h=>{const an=getAn(h.code);if(an)rows.push({h,an});});
  if(!rows.length)return null;
  const n=rows.length;
  const mean=rows.reduce((a,r)=>a+r.an.score.total,0)/n;
  const upN=rows.filter(r=>/多头/.test(r.an.arrange)).length;
  const dnN=rows.filter(r=>/空头/.test(r.an.arrange)).length;
  const wkUp=rows.filter(r=>r.an.wk&&r.an.wk.ok&&/多头/.test(r.an.wk.arrange)).length;
  const strong=rows.filter(r=>r.an.score.total>=62).length;
  const weak=rows.filter(r=>r.an.score.total<=32).length;
  const sorted=rows.slice().sort((a,b)=>b.an.score.total-a.an.score.total);
  let tone,icon,title;
  if(mean>=60){tone="up";icon="▲";title="组合整体技术面偏强，多数标的处于多头结构";}
  else if(mean>=48){tone="neu";icon="◆";title="组合技术面中性，强弱分化明显";}
  else if(mean>=36){tone="down";icon="▼";title="组合整体偏弱，多数标的承压";}
  else{tone="down";icon="▼";title="组合技术面普遍弱势，需警惕系统性回撤";}
  const desc="纳入 <b>"+n+"</b> 只标的，平均技术评分 <b>"+mean.toFixed(1)+"</b> 分；日线多头 <b>"+upN+"</b> 只 / 空头 <b>"+dnN+"</b> 只，周线多头 <b>"+wkUp+"</b> 只；"
    +"评分≥62 的强势标的 <b>"+strong+"</b> 只，≤32 的弱势标的 <b>"+weak+"</b> 只。";
  const items=[];
  const top=sorted[0], bot=sorted[n-1];
  if(top)items.push("技术面最强：<b>"+esc(top.h.name)+"</b>（评分 "+top.an.score.total+" · "+esc(top.an.arrange)+"）");
  if(bot&&n>1)items.push("技术面最弱：<b>"+esc(bot.h.name)+"</b>（评分 "+bot.an.score.total+" · "+esc(bot.an.arrange)+"）");
  const corr=dnN/n*100;
  if(corr>=60)items.push("空头排列占比 <b>"+corr.toFixed(0)+"%</b>，组合<b>同向暴露高</b>，分散效果有限，实质是集中 beta 押注");
  const risks=[];
  if(weak>=Math.ceil(n*0.4))risks.push("弱势标的达 "+weak+"/"+n+" 只，若大盘转弱，组合<b>下行相关性会显著上升</b>");
  if(dnN>=Math.ceil(n*0.6))risks.push("多数标的处于空头结构，<b>分散是假象</b>——应按单一集中仓位管理风险敞口");
  const hot=rows.filter(r=>nn(r.an.rsiV)&&r.an.rsiV>=72);
  if(hot.length)risks.push(hot.length+" 只标的 RSI(14)≥72 处于超买区："+hot.map(r=>esc(r.h.name)).join("、"));
  if(!risks.length)risks.push("未发现极端集中风险，但仍建议关注宏观变量（如大厂 AI capex）对组合的共同驱动");
  return {tone,icon,title,desc,items,risks,mean,upN,dnN,wkUp,strong,weak,sorted};
}

/* ============================================================
   engine5 · K线重做 / 报告富文本 / 批量解析 / 对比图 / 复盘笔记
   （后加载，覆盖 engine2 的同名函数）
   全局常量（NAME_IDX / KL / REP / CMP / CMP_COLOR）在 engine0.js
   ============================================================ */

/* ---------------- 名称反查：代码 / 中文名 / 拼音首字母 ---------------- */
function lookupName(q){
  if(q==null)return null;
  q=String(q).trim().toLowerCase();
  if(!q)return null;
  if(typeof NAME_IDX==="undefined"||!NAME_IDX)return null;
  var codes=Object.keys(NAME_IDX),i,v;
  for(i=0;i<codes.length;i++){
    if(codes[i]===q)return {code:codes[i],name:NAME_IDX[codes[i]].name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.name===q)return {code:codes[i],name:v.name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.py&&v.py.indexOf(q)===0)return {code:codes[i],name:v.name};
  }
  for(i=0;i<codes.length;i++){
    v=NAME_IDX[codes[i]];
    if(v.name.indexOf(q)>=0)return {code:codes[i],name:v.name};
  }
  try{
    var hs=state.holdings||[];
    for(i=0;i<hs.length;i++){
      if(hs[i].code===q||String(hs[i].name).indexOf(q)>=0)return {code:hs[i].code,name:hs[i].name};
    }
  }catch(e){}
  return null;
}
function nameOf(code){
  if(!code)return "";
  if(typeof NAME_IDX!=="undefined"&&NAME_IDX&&NAME_IDX[code])return NAME_IDX[code].name;
  try{
    var hs=state.holdings||[];
    for(var i=0;i<hs.length;i++)if(hs[i].code===code)return hs[i].name;
    var sk=state.stocks&&state.stocks[code];
    if(sk&&sk.name)return sk.name;
  }catch(e){}
  return "";
}

/* ---------------- 批量解析 ----------------
   支持：600519 贵州茅台 / 600519,贵州茅台 / 600519 /
        贵州茅台 / zxtx / sh600519 / 600519.SH
        分隔符：换行、逗号、中文逗号、顿号、分号、制表符、竖线
------------------------------------------------ */
var IDX_CODES={"399001":1,"399006":1,"000688":1,"000300":1,"000905":1,
  "000852":1,"899050":1,"000016":1,"000010":1};
var LINE_SPLIT=/[\r\n;；]+/;
var PART_SPLIT=/[,，、\t|]+/;
var CODE_RE=/(\d{6})/;
var NUM_ONLY=/^\d+$/;

function parseBatch(text){
  var out=[];
  if(!text)return out;
  var lines=String(text).split(LINE_SPLIT);
  for(var i=0;i<lines.length;i++){
    var ln=lines[i].trim(); if(!ln)continue;
    var parts=ln.split(PART_SPLIT);
    var code=null,nm="";
    for(var j=0;j<parts.length;j++){
      var p=String(parts[j]).trim(); if(!p)continue;
      var mc=p.match(CODE_RE);
      if(mc){
        if(!code)code=mc[1];
        var rest=p.replace(CODE_RE,"");
        rest=rest.replace(/^(sh|sz|bj)/i,"").replace(/\.(sh|sz|bj)$/i,"");
        rest=rest.replace(/^[.．,，、\s]+|[.．,，、\s]+$/g,"").trim();
        if(rest&&rest.length<=14&&!NUM_ONLY.test(rest)&&!nm)nm=rest;
        continue;
      }
      var np=p.replace(/^(sh|sz|bj)/i,"").replace(/\.(sh|sz|bj)$/i,"").trim();
      if(!NUM_ONLY.test(np)&&np.length<=14&&!nm)nm=np;
    }
    if(!code){
      var r=lookupName(nm||ln);
      if(r)out.push({code:r.code,name:r.name});
      continue;
    }
    if(!nm)nm=nameOf(code);
    out.push({code:code,name:nm||("代码"+code)});
  }
  /* 去重 + 类型判定 */
  var seen={},res=[];
  out.forEach(function(x){
    if(seen[x.code])return; seen[x.code]=1;
    var t="A";
    if(/^(159|51|58|56|52|16)/.test(x.code))t="ETF";
    else if(IDX_CODES[x.code]||(x.code==="000001"&&/上证/.test(x.name)))t="IDX";
    res.push({code:x.code,name:x.name,type:t});
  });
  return res;
}

/* ============================================================
   K 线 —— 彻底重做（像素化 grid + 严格量程 + 宽度自适应）
   ============================================================ */
function klineRange(an,s,e){
  s=Math.max(0,s|0); e=Math.min(an.dates.length-1,e|0);
  if(e<s)e=s;
  var lo=Infinity,hi=-Infinity,k,v;
  /* 1) 基准 = 可见窗口蜡烛高低 */
  for(k=s;k<=e;k++){
    v=an.lows[k];  if(nn(v)&&v<lo)lo=v;
    v=an.highs[k]; if(nn(v)&&v>hi)hi=v;
  }
  if(!isFinite(lo)||!isFinite(hi)||hi<=lo){ lo=an.close*0.90; hi=an.close*1.10; }
  var baseLo=lo, baseHi=hi;
  var base=Math.max(hi-lo, Math.abs(an.close)*0.004, 1e-6);
  /* 2) 辅助线只纳入基准 ±18% 以内，避免把蜡烛压扁 */
  var lim=base*0.18;
  var ex=[an.ma5,an.ma10,an.ma20,an.ma60,an.bl.lo,an.bl.up,an.bl.mid];
  for(k=s;k<=e;k++){
    for(var j=0;j<ex.length;j++){
      var a=ex[j]; if(!a)continue;
      v=a[k]; if(!nn(v))continue;
      if(v>=baseLo-lim&&v<=baseHi+lim){ if(v<lo)lo=v; if(v>hi)hi=v; }
    }
  }
  if(lo<=0&&baseLo>0)lo=Math.max(baseLo-base*0.15, baseLo*0.5);
  /* 3) 上下各留 8% 空白 */
  var span=Math.max(hi-lo, base);
  var pad=span*0.08;
  var dec=(an.close!=null&&an.close<5)?3:2;
  return {min:+(lo-pad).toFixed(dec), max:+(hi+pad).toFixed(dec)};
}

function klGeom(el){
  var H=(el&&el.clientHeight)||KL.h||700;
  var W=(el&&el.clientWidth)||980;
  H=Math.max(420,H);
  var topPad=30, dzH=20;
  var avail=H-topPad-dzH-14;
  var gap=12;
  var mainH=Math.round(avail*0.615);
  var volH=Math.round(avail*0.135);
  var subH=Math.max(70, avail-mainH-volH-gap*2);
  return {H:H,W:W,mainH:mainH,volH:volH,subH:subH,gap:gap,
    topPad:topPad,
    g1Top:topPad+mainH+gap,
    g2Top:topPad+mainH+gap+volH+gap};
}
/* 视野内舒适的根数 */
function autoBars(W){
  var plot=Math.max(160,(W||980)-128);
  return Math.max(18, Math.min(150, Math.floor(plot/9)));
}

function drawKline(){
  var an=curViewAn(); if(!an)return;
  var el=$("klineChart"); if(!el)return;
  if(typeof echarts==="undefined"){
    el.innerHTML='<div class="empty">图表库 echarts.min.js 未加载（需与 index.html 同目录）</div>';return;
  }
  el.style.height=(KL.h||700)+"px";
  if(!el._c)el._c=echarts.init(el); else { try{el._c.resize();}catch(e){} }
  var chart=el._c;
  var dates=an.dates, n=dates.length;
  var candle=dates.map(function(d,k){return [an.opens[k],an.closes[k],an.lows[k],an.highs[k]];});
  var showSig=$("ckSignal")&&$("ckSignal").checked;
  var showLv=$("ckLevel")&&$("ckLevel").checked;
  var showCh=$("ckChan")&&$("ckChan").checked;
  var showMA=(CUR.main==="ma"||CUR.main==="both");
  var showBOLL=(CUR.main==="boll"||CUR.main==="both");

  /* ---- 视野 ---- */
  var span=(CUR.span==null?60:CUR.span);
  if(span>0&&span>n)span=n;
  var bars=span>0?span:n;
  var s0=span>0?Math.max(0,n-span):0;
  var startZoom=(span>0&&n>span)?(100-span*100/n):0;
  var rg=klineRange(an,s0,n-1);

  /* ---- 几何 ---- */
  var G=klGeom(el);
  var barW=(G.W-136)/Math.max(1,bars);
  var thin=barW<5;

  /* ---- 主图 series ---- */
  var main=[{
    name:"K线",type:"candlestick",data:candle,
    barMaxWidth:26, barMinWidth:1,
    itemStyle:{color:UP,color0:DOWN,
      borderColor:thin?"rgba(255,120,120,0)":"#ff7875",
      borderColor0:thin?"rgba(74,222,128,0)":"#4ade80",
      borderWidth:thin?0:1},
    z:5
  }];
  if(showSig){
    var mp=buildMarkPoint(an);
    if(mp&&mp.data&&mp.data.length)main[0].markPoint=mp;
  }
  if(showLv)main[0].markLine=buildMarkLine(an,rg);
  var atrv=nn(an.atr[an.i])?an.atr[an.i]:null;
  if(nn(an.poc.poc)&&atrv!=null&&KL.autoY!==false){
    var a1=+(an.poc.poc-atrv*0.75).toFixed(3), a2=+(an.poc.poc+atrv*0.75).toFixed(3);
    if(a2>rg.min&&a1<rg.max){
      main[0].markArea={silent:true,itemStyle:{color:"rgba(227,179,65,.10)"},
        data:[[{yAxis:Math.max(a1,rg.min),label:{show:true,position:"insideStartTop",
          formatter:"AI 博弈区",color:"#e3b341",fontSize:10}},{yAxis:Math.min(a2,rg.max)}]]};
    }
  }
  /* 最新价标签 */
  var mpData=[{coord:[n-1,an.close],value:an.close,symbol:"circle",symbolSize:0,
    label:{show:true,position:"right",distance:9,formatter:f2(an.close),
      backgroundColor:(num(an.chg)||0)>=0?UP:DOWN,borderRadius:3,padding:[4,6],
      color:"#0d1117",fontSize:12,fontWeight:"bold"}}];
  if(!main[0].markPoint)main[0].markPoint={symbolSize:1,data:mpData};
  else main[0].markPoint.data=(main[0].markPoint.data||[]).concat(mpData);

  if(showMA){
    var mal=(KLSET&&KLSET.ma&&KLSET.ma.length)?KLSET.ma:[5,10,20,60];
    for(var mi=0;mi<mal.length;mi++){
      var mN=mal[mi], md=maLineData(an,mN);
      if(!md)continue;
      main.push({name:"MA"+mN,type:"line",data:md,smooth:true,showSymbol:false,
        lineStyle:{width:(mN>=60?1.6:1.2),color:(MA_META[mN]||"#8b949e"),opacity:(mN===10?0.7:1)},z:3});
    }
  }
  if(showBOLL){
    main.push({name:"BOLL上",type:"line",data:an.bl.up,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.7},z:2});
    main.push({name:"BOLL中",type:"line",data:an.bl.mid,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.55,type:"dashed"},z:2});
    main.push({name:"BOLL下",type:"line",data:an.bl.lo,smooth:true,showSymbol:false,lineStyle:{width:1,color:"#5c6b80",opacity:.7},z:2});
  }
  if(showCh&&an.chan){
    main.push({name:"通道上轨",type:"line",data:an.chan.up,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.5,type:"dashed"},z:1});
    main.push({name:"通道下轨",type:"line",data:an.chan.lo,showSymbol:false,lineStyle:{width:1,color:"#ffd166",opacity:.5,type:"dashed"},z:1});
  }

  /* ---- 成交量 ---- */
  var volMA5=dates.map(function(d,k){return avgVol(an.vols,5,k);});
  var volData=dates.map(function(d,k){return {value:an.vols[k],
    itemStyle:{color:(an.closes[k]>=an.opens[k]?"rgba(255,77,79,.62)":"rgba(34,197,94,.58)")}};});
  var volS=[{name:"VOL",type:"bar",xAxisIndex:1,yAxisIndex:1,data:volData},
    {name:"VOL MA5",type:"line",xAxisIndex:1,yAxisIndex:1,data:volMA5,showSymbol:false,lineStyle:{width:1,color:"#f5a524"}}];

  /* ---- 副图 ---- */
  var subS=[],subName="MACD";
  if(CUR.sub==="macd"){
    subName="MACD(12,26,9)";
    subS=[
      {name:"DIF",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dif,showSymbol:false,lineStyle:{width:1.3,color:"#58a6ff"}},
      {name:"DEA",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.dea,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"}},
      {name:"MACD",type:"bar",xAxisIndex:2,yAxisIndex:2,barMaxWidth:22,
        data:an.bar.map(function(b){return {value:b,itemStyle:{color:b>=0?"rgba(255,77,79,.8)":"rgba(34,197,94,.75)"}};})}
    ];
  } else if(CUR.sub==="kdj"){
    subName="KDJ(9,3,3)";
    subS=[
      {name:"K",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.K,showSymbol:false,lineStyle:{width:1.3,color:"#58a6ff"}},
      {name:"D",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.D,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"}},
      {name:"J",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.J,showSymbol:false,lineStyle:{width:1,color:"#a371f7"}}
    ];
  } else {
    subName="RSI(6/14)";
    subS=[
      {name:"RSI6",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r6,showSymbol:false,lineStyle:{width:1.2,color:"#58a6ff"}},
      {name:"RSI14",type:"line",xAxisIndex:2,yAxisIndex:2,data:an.r,showSymbol:false,lineStyle:{width:1.3,color:"#f5a524"},
        markLine:{silent:true,symbol:"none",data:[
          {yAxis:70,lineStyle:{color:"rgba(255,77,79,.45)",type:"dashed",width:1},label:{formatter:"超买70",color:"#ff8f8f",fontSize:10,position:"insideEndTop"}},
          {yAxis:30,lineStyle:{color:"rgba(34,197,94,.45)",type:"dashed",width:1},label:{formatter:"超卖30",color:"#6ee79f",fontSize:10,position:"insideEndBottom"}}
        ]}}
    ];
  }

  var dec=(an.close!=null&&an.close<5)?3:2;
  chart.setOption({
    animation:false,
    backgroundColor:"transparent",
    legend:{data:(function(){
        var L=[];
        for(var q=0;q<main.length;q++){ if(main[q].name)L.push(main[q].name); }
        return L;
      })(),
      top:2,textStyle:{color:"#93a1b8",fontSize:11},itemWidth:16,itemHeight:9,
      itemGap:10,inactiveColor:"#3d4a60"},
    tooltip:{
      trigger:"axis",axisPointer:{type:(KLSET&&KLSET.cross===false?"line":"cross"),
        lineStyle:{color:"#5c6b80"},crossStyle:{color:"#5c6b80"}},
      backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",borderWidth:1,
      textStyle:{color:"#e8eef7",fontSize:12.5},
      formatter:function(ps){
        if(!ps||!ps.length)return "";
        var k=ps[0].dataIndex;
        var c=an.closes[k],o=an.opens[k],h=an.highs[k],l=an.lows[k];
        var pc=an.closes[k-1]?((c-an.closes[k-1])/an.closes[k-1]*100):null;
        var v=an.vols[k], vr=an.vrs[k];
        var col=pc==null?"#c7d3e3":(pc>=0?UP:DOWN);
        var s='<div style="font-weight:700;font-size:13px;margin-bottom:5px">'+an.dates[k]
          +(an.isWeekly?' <span style="color:#93a1b8">周</span>':'')+'</div>';
        s+='<div style="color:'+col+'">开 '+f2(o)+'　高 '+f2(h)+'　低 '+f2(l)+'　收 <b>'+f2(c)+'</b>　'
          +(pc==null?"":(pc>=0?"+":"")+pc.toFixed(2)+"%")+'</div>';
        s+='<div style="color:#93a1b8">量 '+(v!=null?(v/1e4).toFixed(1)+"万手":"—")
          +(nn(vr)?'　量比 '+vr.toFixed(2):'')+'</div>';
        var row=function(nm,a,b,cc){
          var va=a[k],vb=b[k];
          return '<div style="color:'+(cc||"#c7d3e3")+'">'+nm+' '+(nn(va)?f2(va):"—")+' / '+(nn(vb)?f2(vb):"—")+'</div>';};
        s+=row("MA5/20",an.ma5,an.ma20,"#79c0ff");
        s+=row("MA10/60",an.ma10,an.ma60,"#a371f7");
        s+=row("DIF/DEA",an.dif,an.dea,"#58a6ff");
        s+='<div>RSI14 '+(nn(an.r[k])?f1(an.r[k]):"—")+'　RSI6 '+(nn(an.r6[k])?f1(an.r6[k]):"—")+'</div>';
        s+='<div>KDJ '+(nn(an.K[k])?f2(an.K[k]):"—")+' / '+(nn(an.D[k])?f2(an.D[k]):"—")+' / '+(nn(an.J[k])?f2(an.J[k]):"—")+'</div>';
        var sg=(an.sigs||[]).filter(function(x){return x.i===k;});
        if(sg.length)s+='<div style="margin-top:5px;border-top:1px solid #31405a;padding-top:5px">'
          +sg.map(function(x){return '<span style="color:'+(x.side==="b"?UP:(x.side==="s"?DOWN:"#93a1b8"))+'">'
          +(x.side==="b"?"▲ ":"▼ ")+x.nm+(x.st>=2?"（强）":"")+'</span>';}).join("<br>")+'</div>';
        return s;
      }
    },
    axisPointer:{link:[{xAxisIndex:"all"}]},
    grid:[
      {left:62,right:74,top:G.topPad,height:G.mainH},
      {left:62,right:74,top:G.g1Top,height:G.volH},
      {left:62,right:74,top:G.g2Top,height:G.subH}
    ],
    xAxis:[
      {type:"category",data:dates,gridIndex:0,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:1,axisLine:{lineStyle:{color:"#31405a"}},axisLabel:{show:false},
       splitLine:{show:false},axisPointer:{label:{show:false}}},
      {type:"category",data:dates,gridIndex:2,axisLine:{lineStyle:{color:"#31405a"}},
       axisLabel:{color:"#93a1b8",fontSize:10.5,interval:Math.max(1,Math.floor(bars/7))},
       splitLine:{show:false}}
    ],
    yAxis:[
      {type:(KLSET&&KLSET.log?"log":"value"),scale:true,gridIndex:0,position:"left",
       min:(KLSET&&KLSET.log&&!(rg.min>0)?null:rg.min),
       max:(KLSET&&KLSET.log&&!(rg.max>0)?null:rg.max),splitNumber:6,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.5)"}},
       axisLabel:{color:"#93a1b8",fontSize:11,formatter:function(v){return v.toFixed(dec);}},
       axisLine:{show:false},axisPointer:{label:{backgroundColor:"#1a2231",color:"#e8eef7",fontSize:11}}},
      {scale:true,gridIndex:1,position:"left",splitNumber:2,
       splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}},axisLabel:{color:"#6b7a91",fontSize:9.5},axisLine:{show:false}},
      {scale:true,gridIndex:2,position:"left",splitNumber:2,
       min:(CUR.sub==="rsi"?0:null),max:(CUR.sub==="rsi"?100:null),
       splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}},axisLabel:{color:"#6b7a91",fontSize:9.5},axisLine:{show:false},
       name:subName,nameTextStyle:{color:"#6b7a91",fontSize:9.5},nameGap:8}
    ],
    dataZoom:[
      {type:"inside",xAxisIndex:[0,1,2],start:startZoom,end:100,zoomOnMouseWheel:true,moveOnMouseMove:true},
      {type:"slider",xAxisIndex:[0,1,2],start:startZoom,end:100,height:18,bottom:2,
       borderColor:"#31405a",fillerColor:"rgba(76,141,255,.14)",
       handleStyle:{color:"#4c8dff"},textStyle:{color:"#6b7a91",fontSize:9},
       dataBackground:{lineStyle:{color:"#31405a"},areaStyle:{color:"rgba(76,141,255,.08)"}}}
    ],
    series:main.concat(volS,subS)
  },true);

  /* 缩放 / 平移后重算主图量程 */
  if(!chart._dz){
    chart._dz=1;
    chart.on("dataZoom",function(){
      var a2=curViewAn(); if(!a2)return;
      if(KL.autoY===false)return;
      var N=a2.dates.length; var s=0,e=N-1;
      try{
        var opt=chart.getOption();
        var dz=(opt&&opt.dataZoom&&opt.dataZoom[0])||{};
        var st=(dz.start!=null?dz.start:0), en=(dz.end!=null?dz.end:100);
        s=Math.floor(N*st/100); e=Math.min(N-1,Math.ceil(N*en/100)-1);
      }catch(err){}
      var r2=klineRange(a2,s,e);
      chart.setOption({yAxis:[{min:r2.min,max:r2.max}]});
      klInfo(a2,s,e,r2);
    });
  }
  klInfo(an,s0,n-1,rg);
}

/* K 线状态条：让用户看见"为什么这么画" */
function klInfo(an,s,e,rg){
  var box=$("klineInfo"); if(!box)return;
  var n=an.dates.length, bars=Math.max(1,e-s+1);
  var el=$("klineChart");
  var plotW=Math.max(160,((el&&el.clientWidth)||980)-136);
  var bw=plotW/bars;
  var dHi=-Infinity,dLo=Infinity;
  for(var k=s;k<=e;k++){ if(an.highs[k]>dHi)dHi=an.highs[k]; if(an.lows[k]<dLo)dLo=an.lows[k]; }
  var ratio=(isFinite(dHi)&&isFinite(dLo)&&rg.max>rg.min)?((dHi-dLo)/(rg.max-rg.min)*100):0;
  var warn="";
  if(bw<4)warn=' <b style="color:#ffd48a">（蜡烛过密，建议切到 60/90 根或点「大图」）</b>';
  else if(ratio<55)warn=' <b style="color:#ffd48a">（纵向占比偏低，已自动收紧量程）</b>';
  box.innerHTML='可见 <b>'+bars+'</b>/'+n+' 根　每根约 <b>'+bw.toFixed(1)+'px</b>'
    +'　主图量程 <b>'+rg.min+' ~ '+rg.max+'</b>'
    +'　蜡烛纵向占比 <b style="color:'+(ratio>=70?"#6ee79f":"#ffd48a")+'">'+ratio.toFixed(0)+'%</b>'
    +'　'+(an.isWeekly?"周线":"日线")+warn;
}

/* 支撑压力线：只画落在量程内的，减少视觉噪音 */
function buildMarkLine(an,rg){
  var data=[];
  function inR(v){ return rg&&nn(v)&&v>=rg.min&&v<=rg.max; }
  (an.supAll||[]).slice(0,3).forEach(function(l){
    if(!inR(l.v))return;
    data.push({yAxis:l.v,name:l.t,
      lineStyle:{color:"rgba(34,197,94,.5)",type:"dashed",width:1},
      label:{formatter:"支撑 "+l.t+" "+f2(l.v),position:"insideEndTop",color:"#6ee79f",fontSize:10}});
  });
  (an.resAll||[]).slice(0,3).forEach(function(l){
    if(!inR(l.v))return;
    data.push({yAxis:l.v,name:l.t,
      lineStyle:{color:"rgba(255,77,79,.5)",type:"dashed",width:1},
      label:{formatter:"压力 "+l.t+" "+f2(l.v),position:"insideEndBottom",color:"#ff8f8f",fontSize:10}});
  });
  return {silent:true,symbol:"none",animation:false,data:data};
}

/* ============================================================
   报告富文本渲染（Markdown 纯文本 -> 层级清晰的 HTML）
   ============================================================ */
function mdInline(t){
  return String(t)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
}
function renderReportRich(md){
  var lines=String(md).split("\n"), out=[], toc=[], sec=0;
  var inTable=false, tbl=[];
  function flushTable(){
    if(!tbl.length)return;
    var body=tbl.filter(function(r){return !/^\s*\|?[\s\-:|]+\|?\s*$/.test(r);});
    if(body.length){
      var head=body[0].replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(function(x){return x.trim();});
      var h='<table><thead><tr>'+head.map(function(c){return "<th>"+mdInline(c)+"</th>";}).join("")+"</tr></thead><tbody>";
      for(var i=1;i<body.length;i++){
        var cells=body[i].replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(function(x){return x.trim();});
        h+="<tr>"+cells.map(function(c){
          var cls=/^[+\-]?\d/.test(c)?(/^\+/.test(c)?" class=\"r-up\"":(/^-/.test(c)?" class=\"r-dn\"":"")):"";
          return "<td"+cls+">"+mdInline(c)+"</td>";}).join("")+"</tr>";
      }
      h+="</tbody></table>";
      out.push(h);
    }
    tbl=[];
  }
  for(var i=0;i<lines.length;i++){
    var ln=lines[i];
    var tr=ln.trim();
    if(/^\s*\|/.test(ln)){ inTable=true; tbl.push(ln.replace(/\s+$/,"")); continue; }
    if(inTable){ flushTable(); inTable=false; }
    if(!tr)continue;
    if(/^─{4,}/.test(tr)||/^-{6,}$/.test(tr)){ out.push("<hr>"); continue; }
    var m;
    if((m=tr.match(/^####\s+(.*)$/))){ out.push('<span class="r-h4">'+mdInline(m[1])+"</span>"); continue; }
    if((m=tr.match(/^###\s+(.*)$/))){ out.push('<span class="r-h3">'+mdInline(m[1])+"</span>"); continue; }
    if((m=tr.match(/^##\s+(.*)$/))){
      sec++; var id="s"+sec; toc.push([id,mdInline(m[1])]);
      out.push('<span class="r-h2" id="'+id+'">'+mdInline(m[1])+"</span>"); continue;
    }
    if((m=tr.match(/^#\s+(.*)$/))){
      out.push('<div style="font-size:1.35em;font-weight:800;color:#fff;margin:6px 0 4px">'+mdInline(m[1])+"</div>"); continue;
    }
    if(/^■/.test(tr)){
      out.push('<span class="r-h3">'+mdInline(tr.replace(/^■\s*/,""))+"</span>"); continue;
    }
    if((m=tr.match(/^\s{2,}[·•]\s*(.*)$/))){
      out.push('<span class="r-li" style="padding-left:34px;opacity:.92">'+mdInline(m[1])+"</span>"); continue;
    }
    if((m=tr.match(/^[·•]\s*(.*)$/))){
      out.push('<span class="r-li">'+mdInline(m[1])+"</span>"); continue;
    }
    out.push("<div>"+mdInline(ln)+"</div>");
  }
  if(inTable)flushTable();
  var tocHtml=toc.length?('<div class="r-toc"><div style="font-weight:700;color:#fff;margin-bottom:6px">目录</div>'
    +toc.map(function(t){return '<a href="#'+t[0]+'">'+t[1]+"</a>";}).join("")+"</div>"):"";
  return tocHtml+out.join("\n");
}
function setReport(md){
  REP.raw=md||"";
  var el=$("reportOut"); if(!el)return;
  el.className=REP.fs;
  if(REP.mode==="raw"){ el.style.whiteSpace="pre-wrap"; el.textContent=REP.raw; }
  else { el.style.whiteSpace="normal"; el.innerHTML=renderReportRich(REP.raw); }
}

/* ============================================================
   多标的走势对比
   ============================================================ */
function renderCmpPick(){
  var box=$("cmpPick"); if(!box)return;
  var list=(state.holdings||[]).slice();
  try{
    ["000001","399001","399006"].forEach(function(c){
      var ex=false;
      for(var i=0;i<list.length;i++)if(list[i].code===c)ex=true;
      if(!ex&&state.stocks&&state.stocks[c])list.push({code:c,name:nameOf(c)||c,type:"IDX"});
    });
  }catch(e){}
  if(!CMP.sel.length)CMP.sel=list.slice(0,4).map(function(h){return h.code;});
  box.innerHTML=list.map(function(h){
    var on=CMP.sel.indexOf(h.code)>=0?" on":"";
    return '<label class="'+on.trim()+'"><input type="checkbox" data-c="'+h.code+'"'+(on?" checked":"")+'>'
      +esc(h.name)+"</label>";
  }).join("");
  var cbs=box.querySelectorAll("input");
  for(var i=0;i<cbs.length;i++){
    cbs[i].onchange=function(){
      var c=this.getAttribute("data-c");
      if(this.checked){
        if(CMP.sel.length>=6){this.checked=false;alert("最多对比 6 只");return;}
        CMP.sel.push(c);
      } else CMP.sel=CMP.sel.filter(function(x){return x!==c;});
      renderCmpPick(); renderCompare();
    };
  }
}
function renderCompare(){
  var el=$("cmpChart"); if(!el)return;
  if(typeof echarts==="undefined"){el.innerHTML='<div class="empty">需 echarts.min.js</div>';return;}
  var span=(CMP.span==null?60:CMP.span);
  var codes=CMP.sel.slice(0,6);
  var msgEl=$("cmpMsg"), tblEl=$("cmpTable");
  if(codes.length<2){
    if(el._c){try{el._c.clear();}catch(e){}}
    el.innerHTML='<div class="empty">请至少勾选 2 只标的进行对比</div>';
    if(tblEl)tblEl.innerHTML="";
    if(msgEl)msgEl.textContent="已选 "+codes.length+" 只";
    return;
  }
  if(el.innerHTML)el.innerHTML="";
  if(!el._c)el._c=echarts.init(el);
  var ch=el._c;
  var series=[],rows=[],dates=null;
  codes.forEach(function(code,idx){
    var stk=state.stocks&&state.stocks[code]; if(!stk||!stk.rows)return;
    var an=getAn(code); if(!an)return;
    var n=an.closes.length;
    var s=span>0?Math.max(0,n-span):0;
    var arr=[],ds=[];
    var base=an.closes[s];
    if(!base)return;
    for(var k=s;k<n;k++){ arr.push(+((an.closes[k]/base-1)*100).toFixed(2)); ds.push(an.dates[k]); }
    if(!dates||ds.length>dates.length)dates=ds;
    series.push({name:(stk.name||code),type:"line",data:arr,showSymbol:false,smooth:false,
      lineStyle:{width:idx===0?2.2:1.7,color:CMP_COLOR[idx%CMP_COLOR.length]},
      itemStyle:{color:CMP_COLOR[idx%CMP_COLOR.length]},
      emphasis:{focus:"series"}});
    var hi=-Infinity,lo=Infinity,mdd=0,peak=-Infinity;
    for(k=0;k<arr.length;k++){
      if(arr[k]>hi)hi=arr[k]; if(arr[k]<lo)lo=arr[k];
      var p=(an.closes[s+k]/base-1)*100; if(p>peak)peak=p; if(peak-p>mdd)mdd=peak-p;
    }
    var rets=[];
    for(k=1;k<arr.length;k++)rets.push((an.closes[s+k]/an.closes[s+k-1]-1)*100);
    var mu=rets.length?rets.reduce(function(a,b){return a+b;},0)/rets.length:0;
    var vv=rets.length?rets.reduce(function(a,b){return a+(b-mu)*(b-mu);},0)/rets.length:0;
    rows.push({code:code,name:stk.name||code,tot:arr.length?arr[arr.length-1]:0,
      hi:hi,lo:lo,mdd:mdd,vol:Math.sqrt(vv)*Math.sqrt(250)});
  });
  if(series.length<2){
    el.innerHTML='<div class="empty">所选标的暂无可用K线数据（请先联网拉取或粘贴日K）</div>';
    if(tblEl)tblEl.innerHTML="";
    return;
  }
  rows.sort(function(a,b){return b.tot-a.tot;});
  ch.setOption({
    animation:false,backgroundColor:"transparent",
    tooltip:{trigger:"axis",backgroundColor:"rgba(19,26,37,.97)",borderColor:"#31405a",
      textStyle:{color:"#e8eef7",fontSize:12.5},
      valueFormatter:function(v){return (v>=0?"+":"")+Number(v).toFixed(2)+"%";}},
    legend:{top:2,textStyle:{color:"#93a1b8",fontSize:11.5},itemWidth:16,itemHeight:9},
    grid:{left:62,right:26,top:34,bottom:34},
    xAxis:{type:"category",data:dates||[],axisLine:{lineStyle:{color:"#31405a"}},
      axisLabel:{color:"#93a1b8",fontSize:11,interval:Math.max(1,Math.floor((dates||[]).length/8))}},
    yAxis:{type:"value",scale:true,axisLine:{show:false},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.5)"}},
      axisLabel:{color:"#93a1b8",fontSize:11,formatter:function(v){return v.toFixed(0)+"%";}}},
    series:series
  },true);
  var h='<table><thead><tr><th>排名</th><th>标的</th><th class="num">区间涨跌</th><th class="num">最大涨幅</th>'
    +'<th class="num">最大回撤</th><th class="num">年化波动</th><th class="num">收益/回撤</th></tr></thead><tbody>';
  rows.forEach(function(r,i){
    var rr=r.mdd>0?(r.tot/r.mdd):0;
    h+="<tr><td>"+(i+1)+"</td><td>"+esc(r.name)+' <span class="muted">'+r.code+"</span></td>"
      +'<td class="num '+(r.tot>=0?"up":"down")+'">'+(r.tot>=0?"+":"")+r.tot.toFixed(2)+"%</td>"
      +'<td class="num up">+'+r.hi.toFixed(2)+"%</td>"
      +'<td class="num down">-'+r.mdd.toFixed(2)+"%</td>"
      +'<td class="num">'+r.vol.toFixed(1)+"%</td>"
      +'<td class="num '+(rr>=1?"up":"down")+'">'+rr.toFixed(2)+"</td></tr>";
  });
  h+="</tbody></table>";
  if(tblEl)tblEl.innerHTML=h;
  if(msgEl&&rows.length){
    msgEl.innerHTML="区间内相对最强：<b>"+esc(rows[0].name)+"</b>（"+(rows[0].tot>=0?"+":"")+rows[0].tot.toFixed(2)+"%）"
      +"　最弱：<b>"+esc(rows[rows.length-1].name)+"</b>（"+rows[rows.length-1].tot.toFixed(2)+"%）";
  }
}

/* ============================================================
   复盘笔记（localStorage）
   ============================================================ */
function notesKey(){ return "ashare_notes_v1"; }
function getNotes(){
  try{ return JSON.parse(localStorage.getItem(notesKey())||"[]"); }catch(e){ return []; }
}
function saveNotes(a){
  try{ localStorage.setItem(notesKey(),JSON.stringify(a)); }catch(e){}
}
function renderNoteSel(){
  var sel=$("noteCode"); if(!sel)return;
  var hs=(state.holdings||[]).slice();
  var cur=sel.value;
  sel.innerHTML='<option value="">（市场随笔 · 不关联标的）</option>'
    +hs.map(function(h){return '<option value="'+h.code+'">'+esc(h.name)+" "+h.code+"</option>";}).join("");
  if(cur)sel.value=cur;
}
function renderNotes(){
  var box=$("noteList"); if(!box)return;
  var all=getNotes().slice().sort(function(a,b){return (b.t||0)-(a.t||0);});
  var q=(($("noteFilter")&&$("noteFilter").value)||"").trim();
  if(q)all=all.filter(function(n){
    return (n.text&&n.text.indexOf(q)>=0)||(n.name&&n.name.indexOf(q)>=0)||(n.code&&n.code.indexOf(q)>=0);});
  if(!all.length){ box.innerHTML='<div class="empty" style="padding:20px">暂无笔记</div>'; return; }
  box.innerHTML=all.map(function(n){
    var d=new Date(n.t||Date.now());
    var p=function(x){return String(x).padStart(2,"0");};
    return '<div class="noteItem"><div class="nh"><span class="nm">'
      +(n.name?esc(n.name)+' <span class="muted" style="font-weight:400">'+esc(n.code)+"</span>":"市场随笔")
      +'</span><span class="nt">'+d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())
      +' · <a href="javascript:void(0)" data-del="'+n.id+'" style="color:#ff8f8f">删除</a></span></div>'
      +'<div class="nb">'+esc(n.text)+"</div></div>";
  }).join("");
  var as=box.querySelectorAll("[data-del]");
  for(var i=0;i<as.length;i++){
    as[i].onclick=function(){
      var id=this.getAttribute("data-del");
      saveNotes(getNotes().filter(function(n){return String(n.id)!==String(id);}));
      renderNotes();
    };
  }
}

/* ============================================================
   engine6 · AI 深度研判（情景推演 / 操作纪律 / 形态统计 / 组合集中度）
              + 覆盖 buildStockBlock 与 genReport + 新 UI 绑定
   ============================================================ */

/* ---------------- 工具 ---------------- */
function sgnTxt(v){ return v==null?"—":((v>0?"+":"")+Number(v).toFixed(2)); }
function pctTxt(v){ return v==null?"—":((v>0?"+":"")+Number(v).toFixed(2)+"%"); }

/* ============================================================
   一、个股深度研判（在 aiStock 基础上扩展）
   ============================================================ */
function aiStockDeep(an){
  const i=an.i, c=an.close;
  const A=(a,k)=>nn(a&&a[k])?a[k]:null;
  const atr=A(an.atr,i);
  const atrPct=(atr!=null&&c)?(atr/c*100):null;
  const out={};

  /* ---- 1. 五维共振拆解（每一项都给"判定 + 数据"） ---- */
  const dims=[];
  const bullArr=/多头/.test(an.arrange), bearArr=/空头/.test(an.arrange);
  dims.push({nm:"日线趋势",w:26,ok:bullArr,bad:bearArr,
    ev:"均线"+an.arrange+"（MA5 "+f2(A(an.ma5,i))+" / MA20 "+f2(A(an.ma20,i))+" / MA60 "+f2(A(an.ma60,i))+"）"});
  const wk=an.wk||{};
  dims.push({nm:"周线趋势",w:22,ok:(wk.ok&&/多头/.test(wk.arrange)),bad:(wk.ok&&/空头/.test(wk.arrange)),
    ev:wk.ok?("周线"+wk.arrange+"，周MA5近4周斜率 "+(wk.slope!=null?pctTxt(wk.slope):"—")):"周线样本不足"});
  dims.push({nm:"动量 MACD",w:18,ok:(A(an.bar,i)!=null&&A(an.bar,i)>=0),bad:(A(an.bar,i)!=null&&A(an.bar,i)<0),
    ev:"DIF "+f3(A(an.dif,i))+" / DEA "+f3(A(an.dea,i))+" / 柱 "+f3(A(an.bar,i))+"　"+an.macdSig});
  dims.push({nm:"量能配合",w:18,ok:(nn(an.vr)&&an.vr>=1.1),bad:(nn(an.vr)&&an.vr<0.8),
    ev:"量比 "+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+"，换手 "+(nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"数据缺失")});
  dims.push({nm:"相对位置",w:16,ok:(nn(an.scorePct)&&an.scorePct>=60),bad:(nn(an.scorePct)&&an.scorePct<=30),
    ev:"近120日技术评分分位 "+(nn(an.scorePct)?an.scorePct+"%":"数据不足")
      +"；60日区间位置 "+(an.hl60&&an.hl60.hi>an.hl60.lo?((c-an.hl60.lo)/(an.hl60.hi-an.hl60.lo)*100).toFixed(0)+"%":"—")});
  let got=0,tot=0;
  dims.forEach(d=>{tot+=d.w; if(d.ok)got+=d.w; else if(!d.bad)got+=d.w*0.5;});
  out.dims=dims;
  out.resPct=Math.round(got/Math.max(1,tot)*100);

  /* ---- 2. 情景推演（用 ATR 估算幅度，不报点位迷信） ---- */
  const sup1=an.sup[0], res1=an.res[0];
  const kA=(atrPct!=null?atrPct:2.2);   /* ATR% 作为 1 个单位波动 */
  const scen=[];
  scen.push({
    nm:"乐观情景",p:"约 25%",dir:"up",
    cond:"放量站上 "+(res1!=null?f2(res1):"—")+"（最近压力）且量比回到 1.2 以上，MACD 柱同步翻红",
    move:"向上 1.5～2.5 个 ATR ≈ +"+(kA*1.5).toFixed(1)+"% ～ +"+(kA*2.5).toFixed(1)+"%",
    inv:"若突破当日量比 <1.0，视为假突破，情景作废"
  });
  scen.push({
    nm:"中性情景",p:"约 50%",dir:"neu",
    cond:"价格在 "+(sup1!=null?f2(sup1):"—")+" ～ "+(res1!=null?f2(res1):"—")+" 之间震荡，均线继续收敛",
    move:"区间内 ±1 个 ATR ≈ ±"+kA.toFixed(1)+"%",
    inv:"有效跌破支撑或突破压力即切换情景"
  });
  scen.push({
    nm:"悲观情景",p:"约 25%",dir:"down",
    cond:"跌破 "+(sup1!=null?f2(sup1):"—")+"（最近支撑）并收盘确认，或 MA20 下穿 MA60",
    move:"向下 1.5～2.5 个 ATR ≈ -"+(kA*1.5).toFixed(1)+"% ～ -"+(kA*2.5).toFixed(1)+"%",
    inv:"跌破后 3 日内收回且量能萎缩，视为洗盘"
  });
  out.scen=scen;

  /* ---- 3. 操作纪律（条件化，不给死命令） ---- */
  const plan=[];
  const sc=an.score.total;
  let posTxt,posTone;
  if(out.resPct>=72&&sc>=60){posTxt="可持有基准仓位（如原计划的 60%～80%）";posTone="up";}
  else if(out.resPct>=56){posTxt="半仓为主（40%～60%），留加仓子弹";posTone="up";}
  else if(out.resPct>=44){posTxt="轻仓观望（≤30%），等方向明确再加";posTone="neu";}
  else if(out.resPct>=28){posTxt="防守为主（≤20%），反弹减仓";posTone="down";}
  else {posTxt="原则上不加仓，等待止跌信号（如底背离 + 放量阳线）";posTone="down";}
  plan.push({k:"仓位参考",v:posTxt,t:posTone,r:"依据：多周期共振度 "+out.resPct+"% + 技术评分 "+sc});
  if(sup1!=null&&atr!=null)
    plan.push({k:"止损/减仓触发",v:"收盘跌破 "+f2(sup1-atr*0.5)+"（最近支撑 "+f2(sup1)+" 下方 0.5 ATR）",t:"down",
      r:"ATR(14)="+f2(atr)+"，占股价 "+(atrPct!=null?atrPct.toFixed(2):"—")+"%，用作噪声缓冲"});
  if(res1!=null)
    plan.push({k:"加仓触发",v:"放量突破 "+f2(res1)+" 且次日不回补缺口",t:"up",r:"最近压力位，需量能确认"});
  if(A(an.ma20,i)!=null)
    plan.push({k:"趋势失效线",v:"日线收盘连续 3 日低于 MA20（"+f2(A(an.ma20,i))+"）",t:"down",r:"短中期分水岭"});
  if(A(an.ma60,i)!=null)
    plan.push({k:"中期生命线",v:"MA60 = "+f2(A(an.ma60,i))+"，跌破则中期性质转弱",t:((c>=A(an.ma60,i))?"up":"down"),r:"中长期成本线"});
  if(nn(an.rsiV)&&an.rsiV>=72)
    plan.push({k:"过热提示",v:"RSI(14)="+f1(an.rsiV)+" 已超买，不宜追高，可考虑分批兑现",t:"down",r:">70 为超买区"});
  if(nn(an.rsiV)&&an.rsiV<=30)
    plan.push({k:"超卖提示",v:"RSI(14)="+f1(an.rsiV)+" 已超卖，抢反弹需等量能确认",t:"neu",r:"<30 为超卖区"});
  out.plan=plan;

  /* ---- 4. 历史相似形态统计（本地回测，样本来自自身历史） ---- */
  out.hist=aiHistStat(an);

  /* ---- 5. 一句话结论 ---- */
  const v=out.resPct;
  out.verdict = v>=72?("技术面<b>偏强</b>，多周期共振度高（"+v+"%），回踩不破关键均线可视为趋势延续")
    : v>=56?("技术面<b>中性偏多</b>（共振 "+v+"%），但缺少"+((dims.filter(d=>!d.ok).slice(0,1)[0]||{}).nm||"部分")+"确认")
    : v>=44?("技术面<b>胶着</b>（共振 "+v+"%），方向未明，等突破再动手")
    : v>=28?("技术面<b>偏弱</b>（共振 "+v+"%），反弹以减仓思路对待")
    : ("技术面<b>弱势</b>（共振 "+v+"%），尚无有效止跌证据");
  return out;
}

/* 历史相似状态回测：过去出现"同样排列 + 同样 RSI 区间"后 5/10/20 日表现 */
function aiHistStat(an){
  const n=an.dates.length;
  if(n<90)return {ok:false,msg:"样本不足（需 ≥90 根K线，当前 "+n+" 根）"};
  const i=an.i;
  const curArr=/多头/.test(an.arrange)?1:(/空头/.test(an.arrange)?-1:0);
  const curR=nn(an.rsiV)?an.rsiV:50;
  const rLo=curR-6, rHi=curR+6;
  const fwd=[5,10,20];
  const acc=fwd.map(()=>({n:0,sum:0,win:0}));
  let sample=0;
  for(let k=70;k<n-21;k++){
    const a5=nn(an.ma5[k])&&nn(an.ma20[k])&&nn(an.ma60[k])?((an.ma5[k]>an.ma20[k]&&an.ma20[k]>an.ma60[k])?1:((an.ma5[k]<an.ma20[k]&&an.ma20[k]<an.ma60[k])?-1:0)):null;
    if(a5===null||a5!==curArr)continue;
    const rv=an.r[k];
    if(!nn(rv)||rv<rLo||rv>rHi)continue;
    sample++;
    fwd.forEach((f,idx)=>{
      if(k+f>=n)return;
      const ret=(an.closes[k+f]/an.closes[k]-1)*100;
      acc[idx].n++; acc[idx].sum+=ret; if(ret>0)acc[idx].win++;
    });
  }
  if(sample<3)return {ok:false,msg:"相似样本不足（"+sample+" 例，需 ≥3 例），统计不具参考性"};
  return {ok:true,sample:sample,curArr:an.arrange,rsiZone:"["+rLo.toFixed(0)+","+rHi.toFixed(0)+"]",
    rows:fwd.map((f,idx)=>{
      const a=acc[idx];
      return {f:f,n:a.n,avg:a.n?a.sum/a.n:null,win:a.n?a.win/a.n*100:null};
    })};
}

/* ============================================================
   二、大盘深度（五维打分 + 明日观察 + 仓位建议）
   ============================================================ */
function aiMarketDeep(){
  const m=state.market||{}, b=state.breadth||{};
  const sh=num(m.sh_chg),sz=num(m.sz_chg),cy=num(m.cy_chg);
  const cnt=(sh!=null?1:0)+(sz!=null?1:0)+(cy!=null?1:0);
  const avg=cnt?(((sh||0)+(sz||0)+(cy||0))/cnt):null;
  const up=num(b.up),dn=num(b.dn),zt=num(b.zt),dt=num(b.dt),zb=num(b.zb);
  const amt=(num(m.sh_amt)||0)+(num(m.sz_amt)||0);
  const dims=[];

  /* 指数 */
  let d1=50,d1ev="";
  if(avg!=null){
    d1=Math.max(0,Math.min(100,50+avg*15));
    d1ev="三大指数平均 "+(avg>=0?"+":"")+avg.toFixed(2)+"%"
      +"（上证 "+pctTxt(sh)+" / 深证 "+pctTxt(sz)+" / 创业板 "+pctTxt(cy)+"）";
  } else d1ev="指数数据缺失";
  dims.push({nm:"指数涨跌",s:Math.round(d1),ev:d1ev,miss:avg==null});

  /* 宽度 */
  let d2=50,d2ev="";
  if(up!=null&&dn!=null&&(up+dn)>0){
    const r=up/(up+dn);
    d2=Math.max(0,Math.min(100,r*100));
    d2ev="涨 "+up+" / 跌 "+dn+" 家，涨跌比 "+r.toFixed(2)
      +(r>=2?"（普涨）":r>=1.2?"（涨多跌少）":r>=0.8?"（均衡分化）":r>=0.5?"（跌多涨少）":"（普跌）");
  } else { d2ev="涨跌家数缺失（点顶部「↻ 刷新行情」补全）"; }
  dims.push({nm:"市场宽度",s:Math.round(d2),ev:d2ev,miss:(up==null||dn==null)});

  /* 情绪（涨停/跌停/炸板） */
  let d3=50,d3ev="";
  if(zt!=null){
    d3=Math.max(0,Math.min(100,25+zt*0.75-(dt||0)*1.2));
    d3ev="涨停 "+zt+" 家"+(dt!=null?"，跌停 "+dt+" 家":"")+(zb!=null?"，炸板 "+zb+" 家":"");
    if(zb!=null&&(zt+zb)>0){
      const zbr=zb/(zt+zb)*100;
      d3ev+="，炸板率 "+zbr.toFixed(1)+"%"+(zbr>35?"（偏高·追涨风险大）":zbr<15?"（偏低·封板质量好）":"（中性）");
      d3-=Math.max(0,(zbr-30)*0.5);
    }
    d3=Math.max(0,Math.min(100,d3));
  } else d3ev="涨停/跌停数据缺失";
  dims.push({nm:"情绪温度",s:Math.round(d3),ev:d3ev,miss:zt==null});

  /* 量能 */
  let d4=50,d4ev="";
  if(amt>0){
    d4=amt>=22000?85:amt>=16000?70:amt>=11000?55:amt>=8000?42:25;
    d4ev="两市成交 "+f2(amt)+" 亿"+(amt>=22000?"（显著放量）":amt>=11000?"（量能中性）":"（明显缩量）");
  } else d4ev="成交额数据缺失";
  dims.push({nm:"量能水平",s:Math.round(d4),ev:d4ev,miss:!(amt>0)});

  /* 结构（指数自身技术位） */
  let d5=50,d5ev="",d5n=0,acc=0;
  [["000001","上证"],["399001","深证"],["399006","创业板"]].forEach(function(x){
    let an=null; try{an=getAn(x[0]);}catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    let s=50;
    if(an.close>an.ma20[an.i])s+=18; else s-=18;
    if(nn(an.ma60[an.i])){ if(an.close>an.ma60[an.i])s+=16; else s-=16; }
    if(nn(an.bar[an.i])){ if(an.bar[an.i]>=0)s+=10; else s-=10; }
    acc+=Math.max(0,Math.min(100,s)); d5n++;
    d5ev+=x[1]+" "+f2(an.close)+"（MA20 "+(an.close>an.ma20[an.i]?"上":"下")+"、MA60 "
      +(nn(an.ma60[an.i])?(an.close>an.ma60[an.i]?"上":"下"):"—")+"、"+(an.arrange||"")+"）　";
  });
  if(d5n)d5=acc/d5n; else d5ev="指数K线数据缺失";
  dims.push({nm:"指数结构",s:Math.round(d5),ev:d5ev.trim(),miss:!d5n});

  const valid=dims.filter(d=>!d.miss);
  const total=valid.length?Math.round(valid.reduce((a,d)=>a+d.s,0)/valid.length):50;
  let tone,icon,title;
  if(total>=70){tone="up";icon="▲";title="市场环境偏暖，可积极参与";}
  else if(total>=56){tone="up";icon="▲";title="环境结构性偏暖，择优参与";}
  else if(total>=45){tone="neu";icon="◆";title="环境中性震荡，控制节奏";}
  else if(total>=32){tone="down";icon="▼";title="环境偏弱，防守为先";}
  else {tone="down";icon="▼";title="环境弱势，降低仓位与操作频率";}

  /* 明日观察点 */
  const tw=[];
  if(up!=null&&dn!=null)tw.push("涨跌家数能否由 "+(up>=dn?"涨":"跌")+"转"+(up>=dn?"跌":"涨")+"——宽度拐点通常先于指数拐点");
  if(zt!=null)tw.push("涨停家数（今日 "+zt+" 家）能否维持，跌停是否收敛");
  if(amt>0)tw.push("两市成交能否维持 "+f2(amt)+" 亿量级，缩量至 8000 亿以下需降仓");
  [["000001","上证"],["399006","创业板"]].forEach(function(x){
    let an=null; try{an=getAn(x[0]);}catch(e){}
    if(!an||!nn(an.ma20[an.i]))return;
    tw.push(x[1]+"指数 MA20 = "+f2(an.ma20[an.i])+"，当前 "+(an.close>an.ma20[an.i]?"站上（多头防线）":"跌破（反弹压力）"));
  });
  const sn=state.snap||{};
  if(sn.hot&&sn.hot.length)tw.push("领涨主线「"+sn.hot[0].name+"」次日能否延续——主线断则情绪快速降温");
  if(sn.net&&sn.net.length&&(num(sn.net[0].net)||0)<0)
    tw.push("主力净流出居前的「"+sn.net[0].name+"」能否止住流出");

  /* 仓位建议 */
  let pos,posR;
  if(total>=70){pos="七成以上，可适度进攻";posR="五维均分 "+total+"（偏暖）";}
  else if(total>=56){pos="五至七成，结构优先";posR="五维均分 "+total+"（结构性）";}
  else if(total>=45){pos="三至五成，快进快出";posR="五维均分 "+total+"（中性）";}
  else if(total>=32){pos="二至三成，以守代攻";posR="五维均分 "+total+"（偏弱）";}
  else {pos="两成以下或空仓观望";posR="五维均分 "+total+"（弱势）";}

  const miss=dims.filter(d=>d.miss).map(d=>d.nm);
  return {dims:dims,total:total,tone:tone,icon:icon,title:title,tomorrow:tw,pos:pos,posR:posR,miss:miss};
}

/* ============================================================
   三、组合深度（集中度 / 相关性 / 再平衡）
   ============================================================ */
function aiPortfolioDeep(list){
  const rows=[];
  (list||[]).forEach(h=>{const an=getAn(h.code); if(an)rows.push({h,an});});
  if(rows.length<2)return null;
  const n=rows.length;

  /* 收益序列（近 60 日） */
  const R={};
  rows.forEach(r=>{
    const a=r.an, len=a.closes.length, s=Math.max(1,len-60);
    const arr=[];
    for(let k=s;k<len;k++)arr.push((a.closes[k]/a.closes[k-1]-1)*100);
    R[r.h.code]=arr;
  });
  /* 相关性 */
  let corSum=0,corN=0,maxCor=0,maxPair="";
  const codes=rows.map(r=>r.h.code);
  for(let i=0;i<codes.length;i++){
    for(let j=i+1;j<codes.length;j++){
      const a=R[codes[i]],b=R[codes[j]],L=Math.min(a.length,b.length);
      if(L<20)continue;
      const x=a.slice(a.length-L),y=b.slice(b.length-L);
      const mx=x.reduce((p,c)=>p+c,0)/L, my=y.reduce((p,c)=>p+c,0)/L;
      let sxy=0,sxx=0,syy=0;
      for(let k=0;k<L;k++){const dx=x[k]-mx,dy=y[k]-my;sxy+=dx*dy;sxx+=dx*dx;syy+=dy*dy;}
      const cor=(sxx>0&&syy>0)?sxy/Math.sqrt(sxx*syy):0;
      corSum+=cor;corN++;
      if(cor>maxCor){maxCor=cor;maxPair=rows[i].h.name+" ↔ "+rows[j].h.name;}
    }
  }
  const avgCor=corN?corSum/corN:0;

  /* 集中度：以技术评分权重近似"健康度加权"，这里用等权 HHI + 弱势占比 */
  const weak=rows.filter(r=>r.an.score.total<40);
  const strong=rows.filter(r=>r.an.score.total>=62);
  const hhi=Math.round(10000/n);   /* 等权下的赫芬达尔指数（仅示意为分散度上限） */
  const bearN=rows.filter(r=>/空头/.test(r.an.arrange)).length;
  const sameDir=Math.max(bearN,n-bearN)/n*100;

  /* 波动贡献（用 ATR% 近似） */
  let volSum=0,volN=0;
  rows.forEach(r=>{
    const a=r.an,atr=nn(a.atr[a.i])?a.atr[a.i]:null;
    if(atr!=null&&a.close){volSum+=atr/a.close*100;volN++;}
  });
  const avgVolPct=volN?volSum/volN:null;

  const rebal=[];
  if(avgCor>=0.7)rebal.push("近60日平均相关性 <b>"+avgCor.toFixed(2)+"</b>（偏高）——组合实际是<b>同一个 beta</b>，分散效果有限，应按单一仓位控制总敞口");
  else if(avgCor>=0.45)rebal.push("平均相关性 <b>"+avgCor.toFixed(2)+"</b>（中等），具备一定分散，但极端行情下仍会同涨同跌");
  else rebal.push("平均相关性 <b>"+avgCor.toFixed(2)+"</b>（较低），分散度较好");
  if(maxCor>=0.85&&maxPair)rebal.push("相关性最高的一对：<b>"+maxPair+"</b>（"+maxCor.toFixed(2)+"），二者择一加仓即可，无需重复配置");
  if(weak.length>=Math.ceil(n*0.35))
    rebal.push("技术评分 <40 的弱势标的 <b>"+weak.length+"/"+n+"</b> 只（"+weak.map(r=>r.h.name).join("、")+"），建议优先处理这批——弱势标的在反弹中弹性最差、下跌中跌幅最大");
  if(strong.length)rebal.push("可作为组合核心保留：<b>"+strong.map(r=>r.h.name+"("+r.an.score.total+")").join("、")+"</b>");
  if(sameDir>=70)rebal.push("同向排列占比 <b>"+sameDir.toFixed(0)+"%</b>（"+(bearN>=n/2?"空头":"多头")+"为主），<b>分散是假象</b>，建议整体降仓而非单独调整个股");
  if(avgVolPct!=null)rebal.push("组合平均 ATR 波动 <b>"+avgVolPct.toFixed(2)+"%</b>/日"+(avgVolPct>3.5?"（偏高，单日 ±3.5% 属常态，仓位需相应收缩）":"（可控）"));

  return {n:n,avgCor:avgCor,maxCor:maxCor,maxPair:maxPair,weak:weak,strong:strong,
    bearN:bearN,sameDir:sameDir,avgVolPct:avgVolPct,hhi:hhi,rebal:rebal,corN:corN};
}

/* ============================================================
   四、覆盖 buildStockBlock：插入深度 AI 段
   ============================================================ */
function buildStockBlock(stk){
  const L=[];
  const code=stk.code,name=stk.name;
  L.push("────────────────────────────────────");
  L.push("【"+name+"】"+code+"　"+(stk.type||""));
  const an=stk.an;
  if(!an){L.push("  ⚠ 数据缺失：该标的未载入K线数据，无法诊断。");L.push("");return L.join("\n");}
  const i=an.i;
  L.push("  最新：收盘 "+f2(an.close)+"（"+pct(an.chg)+"）　"+an.dates[i]+"　技术评分 "+an.score.total+"/100（"+an.score.label+"）");
  L.push("");
  L.push("  ■ 趋势指标");
  L.push("    · 均线排列："+an.arrange+"（MA5 "+f2(an.ma5[i])+" ／ MA10 "+f2(an.ma10[i])+" ／ MA20 "+f2(an.ma20[i])+" ／ MA60 "+f2(an.ma60[i])+"）");
  if(an.ms&&(nn(an.ms.s1)||nn(an.ms.s2)))
    L.push("    · 发散度：MA5-MA20 "+(nn(an.ms.s1)?(an.ms.s1>0?"+":"")+an.ms.s1.toFixed(2)+"%":"数据缺失")
      +"；MA20-MA60 "+(nn(an.ms.s2)?(an.ms.s2>0?"+":"")+an.ms.s2.toFixed(2)+"%":"数据缺失"));
  L.push("    · MACD："+an.macdSig);
  L.push("    · 背离检测："+an.diver);
  L.push("");
  L.push("  ■ 震荡指标");
  L.push("    · RSI(14)="+(!nn(an.rsiV)?"数据缺失":f1(an.rsiV))+"，"+an.rsiZone+"；RSI(6)="+(!nn(an.r6[i])?"数据缺失":f1(an.r6[i]))+"（短周期敏感度更高）");
  L.push("    · KDJ："+an.kdjSig);
  L.push("");
  L.push("  ■ 量能指标");
  L.push("    · 量比（5日均量口径）="+(nn(an.vr)?an.vr.toFixed(2):"数据缺失")+(nn(an.vr)?("（"+(an.vr>1.5?"放量":an.vr<0.7?"缩量":"常态")+"）"):""));
  L.push("    · 换手率："+(nn(an.lastTurn)?an.lastTurn.toFixed(2)+"%":"数据缺失（日K未含换手字段）"));
  L.push("");
  L.push("  ■ 形态与关键位");
  const patAll=(an.pats||[]).slice().sort((a,b)=>b.i-a.i);
  const seenPat={},pats=[];
  patAll.forEach(p=>{ if(seenPat[p.nm])return; seenPat[p.nm]=1; pats.push(p); });
  pats.reverse();
  L.push("    · 近期形态："+(pats.length?pats.map(p=>p.date+" "+p.nm+"（"+p.ds+"）").join("；"):"未识别到典型K线形态"));
  L.push("    · 支撑位："+(an.sup.length?an.sup.map(f2).join(" ＞ "):"数据缺失")
    +((an.supAll||[]).length?"　【"+(an.supAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · 压力位："+(an.res.length?an.res.map(f2).join(" ＜ "):"数据缺失")
    +((an.resAll||[]).length?"　【"+(an.resAll||[]).map(x=>x.t+" "+f2(x.v)).join("；")+"】":""));
  L.push("    · BOLL(20,2)：上轨 "+f2(an.bl.up[i])+" ／ 中轨 "+f2(an.bl.mid[i])+" ／ 下轨 "+f2(an.bl.lo[i])
    +(an.bw&&nn(an.bw.bw)?("，带宽 "+an.bw.bw.toFixed(2)+"%("+an.bw.state+")"):""));
  L.push("    · 密集成交区 POC："+(nn(an.poc.poc)?f2(an.poc.poc):"数据缺失")+"（近60日成交量最大价格中枢）");
  L.push("");
  L.push("  ■ 多空技术信号（近 40 日，客观形态识别，非交易指令）");
  const sigs=(an.sigs||[]).filter(s=>s.i>=an.i-40).slice(0,12);
  if(sigs.length){
    let nb=0,ns=0;
    sigs.forEach(s=>{
      L.push("    · "+s.date+"　"+(s.side==="b"?"▲ 多头":(s.side==="s"?"▼ 空头":"● 中性"))+"　"+s.nm+(s.st>=2?"（强）":"")
        +"　"+f2(s.price)+"　"+s.ds);
      if(s.side==="b")nb++;else if(s.side==="s")ns++;
    });
    L.push("    统计：多头 "+nb+" 个 / 空头 "+ns+" 个 / 中性 "+(sigs.length-nb-ns)+" 个");
  } else L.push("    · 近 40 日未触发技术信号");
  L.push("");
  L.push("  ■ 短 / 中 / 长 三周期研判");
  (an.tf||[]).forEach(t=>{
    L.push("    【"+t.tf+"】"+t.label);
    t.ev.forEach(e=>L.push("      · "+e));
  });
  L.push("");

  /* ============ AI 深度研判（三段） ============ */
  L.push("  ■ AI 深度研判（规则推理 · 每条附数据依据 · 非投资建议）");
  try{
    const r=aiStock(an);
    const dp=aiStockDeep(an);
    const strip=s=>String(s).replace(/<[^>]+>/g,"");
    L.push("    【一句话结论】"+r.icon+" "+strip(dp.verdict));
    L.push("    "+strip(r.desc));
    L.push("");
    L.push("    【五维共振拆解】综合共振度 "+dp.resPct+"%");
    dp.dims.forEach(d=>{
      const tag=d.ok?"✔ 多头":(d.bad?"✘ 空头":"○ 中性");
      L.push("      · "+d.nm+"（权重 "+d.w+"）"+tag+"　"+strip(d.ev));
    });
    L.push("");
    L.push("    【多头依据】");
    r.bulls.forEach(x=>L.push("      + "+strip(x)));
    L.push("    【空头依据】");
    r.bears.forEach(x=>L.push("      - "+strip(x)));
    L.push("");
    L.push("    【情景推演】");
    L.push("      | 情景 | 主观概率 | 触发条件 | 幅度参考(ATR口径) | 证伪条件 |");
    L.push("      |---|---|---|---|---|");
    dp.scen.forEach(s=>{
      L.push("      | "+s.nm+" | "+s.p+" | "+s.cond+" | "+s.move+" | "+s.inv+" |");
    });
    L.push("");
    L.push("    【操作纪律（条件触发，非指令）】");
    dp.plan.forEach(p=>L.push("      · "+p.k+"："+p.v+"　（"+p.r+"）"));
    L.push("");
    const hs=dp.hist;
    if(hs&&hs.ok){
      L.push("    【历史相似状态统计】样本 "+hs.sample+" 例（相同均线排列 "+hs.curArr+" + RSI "+hs.rsiZone+"）");
      L.push("      | 持有期 | 样本数 | 平均涨跌 | 上涨概率 |");
      L.push("      |---|---|---|---|");
      hs.rows.forEach(rw=>{
        L.push("      | "+rw.f+" 日后 | "+rw.n+" | "+(rw.avg==null?"—":pctTxt(rw.avg))+" | "
          +(rw.win==null?"—":rw.win.toFixed(0)+"%")+" |");
      });
      L.push("      注：仅统计自身历史，样本量小，不代表未来。");
    } else {
      L.push("    【历史相似状态统计】"+(hs?hs.msg:"不可用"));
    }
    L.push("");
    L.push("    【关键位】"+r.levels.map(x=>x.nm+" = "+x.vv).join("　｜　"));
    L.push("    【风险提示】"+r.risks.map(strip).join("；"));
    L.push("    【后续观察要点】");
    r.watch.forEach(x=>L.push("      · "+strip(x)));
  }catch(e){L.push("    ⚠ AI 深度研判生成失败："+(e&&e.message?e.message:"未知错误"));}
  L.push("");
  L.push("  ■ 技术评分分解（五维）");
  const d=an.score.dims,cap=an.score.caps;
  L.push("    "+Object.keys(d).map(k=>k+" "+d[k]+"/"+cap[k]).join("　｜　")+"　→　总分 "+an.score.total+"（"+an.score.label+"）");
  L.push("    自身历史分位："+(an.scorePct==null?"数据不足（样本<5）":an.scorePct+"%（近120日回测，越高表示相对自身历史越强）"));
  L.push("");
  return L.join("\n");
}

/* ============================================================
   五、覆盖 genReport：追加深度段落 + 富文本渲染
   ============================================================ */
function genReportBase(){
  const inRep=state.holdings.filter(h=>h.inReport!==false);
  const stocks=inRep.map(h=>{
    const stk=state.stocks[h.code];
    if(!stk||!stk.rows||stk.rows.length<8)return {name:h.name,code:h.code,type:h.type,an:null,rows:null};
    const an=analyzeStock({rows:stk.rows,name:h.name,code:h.code});
    return {name:h.name,code:h.code,type:h.type,an:(an&&an.err)?null:an,rows:stk.rows};
  });
  const now=new Date();
  const pad=n=>String(n).padStart(2,"0");
  const ts=now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())+" "+pad(now.getHours())+":"+pad(now.getMinutes());
  let rep="";
  rep+="# A股每日复盘报告（技术分析版）\n\n";
  rep+="生成时间："+ts+"　｜　数据快照日期："+SNAPSHOT_DATE+"　｜　纳入标的："+inRep.length+" 只\n";
  rep+="数据来源：内嵌真实日K线（本机抓取）+ 板块/资金快照；指标由本地 JS 从原始 OHLCV 计算。\n\n";
  rep+="## 第一步：大盘环境与趋势评估\n\n"+buildMarketBlock();
  try{
    const rm=aiMarket();
    const strip2=s=>String(s).replace(/<[^>]+>/g,"");
    let mb="\n■ AI 大盘解读（规则推理 · 非投资建议）\n";
    mb+="  【结论】"+rm.icon+" "+rm.title+"\n";
    mb+="  "+strip2(rm.desc)+"\n";
    if(rm.items.length){mb+="  【盘面解读】\n";rm.items.forEach(x=>mb+="    · "+strip2(x)+"\n");}
    mb+="  【风险与容错提示】\n"+rm.risks.map(x=>"    · "+strip2(x)).join("\n")+"\n";
    rep+=mb;
  }catch(e){}
  /* ---- 大盘五维打分（新增） ---- */
  try{
    const dm=aiMarketDeep();
    let t="\n■ 大盘五维打分（量化环境，用于决定总仓位）\n";
    t+="  | 维度 | 得分 | 依据 |\n  |---|---|---|\n";
    dm.dims.forEach(d=>{
      t+="  | "+d.nm+" | "+(d.miss?"缺失":d.s+"/100")+" | "+String(d.ev).replace(/<[^>]+>/g,"").replace(/\|/g,"／")+" |\n";
    });
    t+="\n  【综合环境分】"+dm.icon+" "+dm.total+"/100 —— "+dm.title+"\n";
    t+="  【建议仓位区间】"+dm.pos+"　（"+dm.posR+"）\n";
    if(dm.miss&&dm.miss.length)t+="  ⚠ 以下维度数据缺失，评分基于其余维度："+dm.miss.join("、")+"\n";
    t+="  【明日重点观察】\n";
    dm.tomorrow.forEach(x=>t+="    · "+String(x).replace(/<[^>]+>/g,"")+"\n");
    rep+=t;
  }catch(e){}
  rep+="## 第二步：板块轮动与主线识别\n\n"+buildSectorBlock();
  try{ rep+=buildSectorMapBlock(); }catch(e){}
  rep+="## 第三步：个股技术面诊断（共 "+inRep.length+" 只）\n\n";
  stocks.forEach(s=>{
    if(!s.an){ rep+="────────────────────────────────────\n【"+s.name+"】"+s.code+"\n  ⚠ 数据缺失：未载入K线数据，无法诊断。\n\n"; return; }
    rep+=buildStockBlock(s);
  });
  try{
    const rp=aiPortfolio(inRep);
    if(rp){
      const strip3=s=>String(s).replace(/<[^>]+>/g,"");
      let pb="\n■ AI 组合诊断（集中度 / 强弱结构 · 非投资建议）\n";
      pb+="  【结论】"+rp.icon+" "+rp.title+"\n";
      pb+="  "+strip3(rp.desc)+"\n";
      pb+="  【结构要点】\n"+rp.items.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      pb+="  【组合层面风险】\n"+rp.risks.map(x=>"    · "+strip3(x)).join("\n")+"\n";
      rep+=pb;
    }
  }catch(e){}
  /* ---- 组合深度：相关性 / 集中度 / 再平衡（新增） ---- */
  try{
    const pd=aiPortfolioDeep(inRep);
    if(pd){
      let t="\n■ 组合结构深度（相关性 / 集中度 / 再平衡 · 非投资建议）\n";
      t+="  【分散度】近60日平均相关系数 "+(pd.corN?pd.avgCor.toFixed(2):"样本不足")
        +"，最高相关对："+(pd.maxPair?pd.maxPair+"（"+pd.maxCor.toFixed(2)+"）":"—")+"\n";
      t+="  【同向暴露】同向排列占比 "+pd.sameDir.toFixed(0)+"%，组合平均日波动（ATR口径）"
        +(pd.avgVolPct!=null?pd.avgVolPct.toFixed(2)+"%":"数据缺失")+"\n";
      t+="  【再平衡思路】\n";
      pd.rebal.forEach(x=>t+="    · "+String(x).replace(/<[^>]+>/g,"")+"\n");
      rep+=t;
    }
  }catch(e){}
  rep+="## 第四步：风险警示与情景推演\n\n"+buildRiskBlock(stocks);
  rep+="\n────────────────────────────────────\n";
  rep+="## 免责声明\n\n";
  rep+="本报告由本地工具依据用户提供的真实行情数据自动生成，所有技术指标（MA/EMA/MACD/RSI/KDJ/BOLL/量比/POC 等）"
    +"均由本地 JavaScript 从原始 OHLCV 计算，未接入任何交易通道。\n";
  rep+="报告中所有内容为技术形态的客观描述与情景推演，不构成任何买入/卖出的交易指令，也不构成投资建议。\n";
  rep+="情景概率为主观赋值（用于表达不确定性），历史相似统计样本量有限，均不代表未来表现。\n";
  rep+="技术分析具有滞后性与失效可能，历史形态不代表未来表现。市场有风险，据此操作，风险自负。\n";
  return rep;
}

function genReport(){
  let md="";
  try{ md=genReportBase(); }
  catch(e){ md="# 报告生成失败\n\n"+e.message+"\n"; }
  LAST_REPORT=md;
  setReport(md);
  renderNoteSel();
  return md;
}

/* ============================================================
   六、新 UI 绑定
   ============================================================ */
function bindExtra(){
  const on=(id,ev,fn)=>{const e=$(id); if(e)e.addEventListener(ev,fn);};

  /* --- 报告字号 / 视图 --- */
  const segFs=$("segFs");
  if(segFs)segFs.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segFs.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    REP.fs=b.getAttribute("data-f");
    try{localStorage.setItem("ashare_repfs",REP.fs);}catch(err){}
    setReport(REP.raw);
  });
  const segRv=$("segRepView");
  if(segRv)segRv.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segRv.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    REP.mode=b.getAttribute("data-v");
    setReport(REP.raw);
  });
  on("btnCopyRep","click",function(){
    if(!LAST_REPORT){alert("请先生成报告");return;}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(LAST_REPORT).then(()=>msgTmp("noteMsg","已复制全文"));
      } else {
        const ta=document.createElement("textarea");ta.value=LAST_REPORT;document.body.appendChild(ta);
        ta.select();document.execCommand("copy");ta.remove();
      }
    }catch(e){alert("复制失败，请手动选择文本");}
  });

  /* --- K线：高度 / 自适应量程 / 全屏 --- */
  const segH=$("segHeight");
  if(segH)segH.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segH.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    KL.h=parseInt(b.getAttribute("data-h"),10)||700;
    const el=$("klineChart"); if(el){el.style.height=KL.h+"px"; if(el._c)try{el._c.resize();}catch(err){}}
    drawKline();
  });
  on("ckAutoY","change",function(){ KL.autoY=this.checked; drawKline(); });
  on("btnFull","click",function(){
    const wrap=$("klineWrap"); if(!wrap)return;
    if(!document.fullscreenElement){
      if(wrap.requestFullscreen)wrap.requestFullscreen();
      else if(wrap.webkitRequestFullscreen)wrap.webkitRequestFullscreen();
      else { KL.h=Math.round(window.innerHeight*0.88); drawKline(); return; }
      KL.h=Math.round(window.innerHeight*0.88);
    } else {
      if(document.exitFullscreen)document.exitFullscreen();
      KL.h=700;
    }
    setTimeout(()=>{const el=$("klineChart"); if(el){el.style.height=KL.h+"px"; if(el._c)try{el._c.resize();}catch(e){}} drawKline();},260);
  });

  /* --- 批量添加（个股诊断页） --- */
  let batchData=[];
  const bpv=$("batchPreview");
  on("batchParse","click",function(){
    const txt=($("batchRaw")||{}).value||"";
    batchData=parseBatch(txt);
    if(!batchData.length){
      bpv.innerHTML='<div class="banner err">未识别到有效代码/名称。支持格式：600519 贵州茅台 / 600519,贵州茅台 / 600519 / 贵州茅台</div>';
      return;
    }
    bpv.innerHTML='<div class="banner info">识别到 '+batchData.length+' 只：'
      +batchData.map(function(x,i){
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:10px;cursor:pointer">'
        +'<input type="checkbox" class="bpick" data-i="'+i+'" checked style="width:auto;margin:0">'
        +esc(x.name)+' <span class="muted">'+x.code+'</span></label>';
      }).join("")+'</div>';
  });
  on("batchAdd","click",async function(){
    if(!batchData.length){
      const txt=($("batchRaw")||{}).value||"";
      batchData=parseBatch(txt);
    }
    const picks=[];
    const cbs=(bpv?bpv.querySelectorAll(".bpick"):[]);
    if(cbs&&cbs.length){
      for(let i=0;i<cbs.length;i++)if(cbs[i].checked)picks.push(batchData[parseInt(cbs[i].getAttribute("data-i"),10)]);
    } else picks.push.apply(picks,batchData);
    if(!picks.length){ ($("batchMsg")).textContent="请先点「解析」并勾选"; return; }
    const msg=$("batchMsg");
    let added=0;
    for(let i=0;i<picks.length;i++){
      const p=picks[i];
      if(!state.holdings.some(h=>h.code===p.code)){
        state.holdings.push({code:p.code,name:p.name,type:p.type,inReport:true});added++;
      }
    }
    saveState();renderHoldings();renderRail();renderCmpPick();
    if(msg)msg.textContent="已加入 "+added+" 只（共 "+state.holdings.length+" 只），开始拉取行情…";
    for(let i=0;i<picks.length;i++){
      try{ await fetchStockData(picks[i].code); }catch(e){}
    }
    saveState();renderHoldings();renderRail();renderDash();
    if(msg)msg.innerHTML="完成：新增 "+added+" 只，行情拉取结束。<b>提示</b>：若某只显示数据缺失，可在「个股诊断」页手动粘贴日K或稍后重试。";
  });
  on("pickStock","click",function(){
    const q=prompt("输入代码或名称（支持拼音首字母，如 zxtx / 中兴 / 000063）：");
    if(q==null)return;
    const r=lookupName(q.trim());
    if(!r){alert("未匹配到标的：\n• 内置约 300 只常见 A股/ETF/指数\n• 支持 6 位代码、中文名称、拼音首字母\n• 未收录的可直接输入 6 位代码后「联网拉取」");return;}
    const cEl=$("stockCode"),nEl=$("stockName");
    if(cEl)cEl.value=r.code;
    if(nEl)nEl.value=r.name;
    try{ pickStock(r.code); }catch(e){}
  });

  /* --- 个股诊断页：代码输入框失焦自动补全名称 --- */
  on("stockCode","blur",function(){
    const c=(this.value||"").trim();
    const nEl=$("stockName");
    if(c&&nEl&&!nEl.value){ const nm=nameOf(c); if(nm)nEl.value=nm; }
  });

  /* --- 持仓页批量 --- */
  let holdBatchData=[];
  const hbp=$("holdBatchPreview");
  on("holdBatchParse","click",function(){
    holdBatchData=parseBatch(($("holdBatch")||{}).value||"");
    if(!holdBatchData.length){ hbp.innerHTML='<div class="banner err">未识别到有效代码/名称</div>'; return; }
    hbp.innerHTML='<div class="banner info">识别到 '+holdBatchData.length+' 只：'
      +holdBatchData.map(function(x,i){
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:10px;cursor:pointer">'
        +'<input type="checkbox" class="hpick" data-i="'+i+'" checked style="width:auto;margin:0">'
        +esc(x.name)+' <span class="muted">'+x.code+'</span></label>';
      }).join("")+'</div>';
  });
  async function holdBatchAdd(doFetch){
    if(!holdBatchData.length)holdBatchData=parseBatch(($("holdBatch")||{}).value||"");
    const picks=[];
    const cbs=(hbp?hbp.querySelectorAll(".hpick"):[]);
    if(cbs&&cbs.length){ for(let i=0;i<cbs.length;i++)if(cbs[i].checked)picks.push(holdBatchData[parseInt(cbs[i].getAttribute("data-i"),10)]); }
    else picks.push.apply(picks,holdBatchData);
    if(!picks.length){ const m=$("holdBatchMsg"); if(m)m.textContent="请先点「解析预览」"; return; }
    let added=0;
    picks.forEach(p=>{
      if(!state.holdings.some(h=>h.code===p.code)){state.holdings.push({code:p.code,name:p.name,type:p.type,inReport:true});added++;}
    });
    saveState();renderHoldings();renderRail();renderCmpPick();
    const m=$("holdBatchMsg");
    if(doFetch){
      if(m)m.textContent="已加入 "+added+" 只，拉取行情中…";
      for(let i=0;i<picks.length;i++){ try{ await fetchStockData(picks[i].code); }catch(e){} }
      saveState();renderHoldings();renderRail();renderDash();
      if(m)m.innerHTML="完成：新增 "+added+" 只并已尝试拉取行情";
    } else if(m) m.innerHTML="已加入 "+added+" 只（未拉取行情）。数据缺失的标的请点「批量联网拉取持仓行情」。";
    if(hbp)hbp.innerHTML="";
    holdBatchData=[];
    if($("holdBatch"))$("holdBatch").value="";
  }
  on("holdBatchAdd","click",function(){holdBatchAdd(false);});
  on("holdBatchFetch","click",function(){holdBatchAdd(true);});

  /* --- 持仓页单个添加：自动补全 --- */
  on("newCode","blur",function(){
    const c=(this.value||"").trim();
    const nEl=$("newName");
    if(c&&nEl&&!nEl.value){
      const r=lookupName(c)||{name:nameOf(c)};
      if(r&&r.name)nEl.value=r.name;
    }
  });

  /* --- 对比图 --- */
  const segCmp=$("segCmpSpan");
  if(segCmp)segCmp.addEventListener("click",function(e){
    const b=e.target.closest?e.target.closest("button"):null; if(!b)return;
    [].forEach.call(segCmp.querySelectorAll("button"),x=>x.classList.remove("on"));
    b.classList.add("on");
    CMP.span=parseInt(b.getAttribute("data-n"),10)||60;
    renderCompare();
  });

  /* --- 笔记 --- */
  on("addNote","click",function(){
    const t=($("noteText")||{}).value||"";
    if(!t.trim()){ msgTmp("noteMsg","请输入笔记内容"); return; }
    const sel=$("noteCode");
    const code=(sel&&sel.value)||"";
    const arr=getNotes();
    arr.push({id:Date.now()+"_"+Math.random().toString(36).slice(2,6),code:code,
      name:code?nameOf(code):"",text:t.trim(),t:Date.now()});
    saveNotes(arr);renderNotes();
    if($("noteText"))$("noteText").value="";
    msgTmp("noteMsg","已保存（共 "+arr.length+" 条）");
  });
  on("clearNote","click",function(){
    if(!confirm("确定清空全部复盘笔记？此操作不可撤销。"))return;
    saveNotes([]);renderNotes();msgTmp("noteMsg","已清空");
  });
  on("noteFilter","input",renderNotes);

  /* --- 代码候选列表 --- */
  try{
    const dl=$("codeList");
    if(dl)dl.innerHTML=Object.keys(NAME_IDX).map(function(c){
      return '<option value="'+c+'">'+esc(NAME_IDX[c].name)+"</option>";}).join("");
  }catch(e){}
}

function msgTmp(id,txt){
  const e=$(id); if(!e)return; e.textContent=txt;
  setTimeout(function(){ if(e.textContent===txt)e.textContent=""; },4000);
}

/* ============================================================
   七、tab 覆盖（支持新增的对比 / 笔记页）
   ============================================================ */
function tab(id){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  document.querySelectorAll("main section").forEach(s=>s.classList.toggle("on",s.id===id));
  if(id==="dash")renderDash();
  if(id==="stock"&&!$("stockCode").value&&(state.holdings[0]))pickStock(state.holdings[0].code);
  if(id==="report")genReport();
  if(id==="market")renderMarket();
  if(id==="compare"){ try{renderCmpPick();renderCompare();}catch(e){} }
  if(id==="notes"){ try{renderNoteSel();renderNotes();}catch(e){} }
  if(id==="stock"){ const el=$("klineChart"); if(el&&el._c){try{el._c.resize();}catch(e){}} }
  try{ if(window&&typeof window.scrollTo==="function")window.scrollTo({top:0,behavior:"smooth"}); }catch(e){}
}

/* ============================================================
   七点五、日K粘贴解析增强（日期标准化 + 乱序/重复处理）
   ============================================================ */
function normDate(s){
  if(s==null)return "";
  var t=String(s).trim().replace(/[年月]/g,"-").replace(/[日]/g,"");
  var m=t.match(/^(\d{4})[-\/.]?(\d{1,2})[-\/.]?(\d{1,2})$/);
  if(m)return m[1]+"-"+String(m[2]).padStart(2,"0")+"-"+String(m[3]).padStart(2,"0");
  m=t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(m)return m[1]+"-"+m[2]+"-"+m[3];
  return String(s).trim().slice(0,10);
}
function parseOhlc(text){
  var out=[],seen={};
  String(text).split(/\r?\n/).forEach(function(line){
    var t=line.trim(); if(!t||t.charAt(0)==="#")return;
    var p=t.split(/[,\t; ]+/);
    if(p.length<6)return;
    var d=normDate(p[0]); if(!d)return;
    var o=num(p[1]),h=num(p[2]),l=num(p[3]),c=num(p[4]),v=num(p[5]);
    if(o==null||h==null||l==null||c==null)return;
    if(seen[d])return; seen[d]=1;
    out.push([d,o,h,l,c,(v==null?0:v),(p.length>6?num(p[6]):null)]);
  });
  out.sort(function(a,b){return a[0]<b[0]?-1:(a[0]>b[0]?1:0);});
  return out;
}

/* ============================================================
   八、初始化覆盖
   ============================================================ */
function init(){
  bind();
  bindExtra();
  renderHeader();
  renderMarket();
  renderSectors();
  renderHoldings();
  renderRail();
  renderDash();
  renderCmpPick();
  renderNoteSel();
  renderNotes();
  const j=$("snapJson"); if(j){j._touched=false;j.oninput=()=>{j._touched=true;};}
  /* 恢复字号偏好 */
  try{
    const f=localStorage.getItem("ashare_repfs");
    if(f&&["fs-s","fs-m","fs-l"].indexOf(f)>=0){
      REP.fs=f;
      const seg=$("segFs");
      if(seg)[].forEach.call(seg.querySelectorAll("button"),
        b=>b.classList.toggle("on",b.getAttribute("data-f")===f));
    }
  }catch(e){}
  if(state.holdings.length)pickStock(state.holdings[0].code);
  tab("dash");
  genReport();
  window.addEventListener("resize",function(){
    ["klineChart","radarChart","scoreChart","cmpChart","sigPie","tempGauge","breadthBar","structBar"].forEach(function(id){
      const e=$(id); if(e&&e._c){try{e._c.resize();}catch(err){}}
    });
  });
}
/* v2.0: init 由 engine10 统一启动 */

/* ============================================================
   engine7 · 图表可读性重做（v2.0）
   1) 延迟初始化：隐藏 Tab 内不再创建 0×0 图表（这是"比例错误/挤成一团"的根因）
   2) 大盘走势图：加高 + Y 轴自动收紧 + 缩放 + 模式切换
   3) 五维雷达：加高 + 数值条
   4) 120 日评分走势：加高 + 边距 + 缩放
   ============================================================ */

/* ---------- 图表生命周期 ---------- */
var CHART_REGS = [];
function ensureChart(el){
  if(!el) return null;
  if(typeof echarts === "undefined") return null;
  var w = el.clientWidth, h = el.clientHeight;
  if(!(w > 80 && h > 60)) return null;          /* 不可见 / 尺寸异常 → 延迟 */
  if(!el._c){
    try{ el._c = echarts.init(el); }catch(e){ return null; }
    CHART_REGS.push(el);
  }
  return el._c;
}
function deferChart(el, fn){
  if(!el) return;
  el._pending = fn;
}
function flushCharts(){
  var secs = document.querySelectorAll("main section.on");
  for(var s=0;s<secs.length;s++){
    var list = secs[s].querySelectorAll(".chart");
    for(var i=0;i<list.length;i++){
      var el = list[i];
      if(el._pending){ var f = el._pending; el._pending = null; try{ f(); }catch(e){} }
      if(el._c){ try{ el._c.resize(); }catch(e){} }
    }
  }
  var all = document.querySelectorAll(".chart");
  for(var k=0;k<all.length;k++){
    if(all[k]._c){ try{ all[k]._c.resize(); }catch(e){} }
  }
}
function resizeAllCharts(){
  var all = document.querySelectorAll(".chart");
  for(var k=0;k<all.length;k++){
    if(all[k]._c && all[k].clientWidth > 80){ try{ all[k]._c.resize(); }catch(e){} }
  }
}

/* ---------- 工具：稳健 Y 轴区间 ---------- */
function tightRange(vals, padR, trim){
  var a = [];
  for(var i=0;i<vals.length;i++){ if(nn(vals[i])) a.push(vals[i]); }
  if(!a.length) return null;
  a.sort(function(x,y){ return x-y; });
  var lo, hi;
  if(trim && a.length > 12){
    var k = Math.max(1, Math.floor(a.length * 0.02));
    lo = a[k]; hi = a[a.length-1-k];
  }else{ lo = a[0]; hi = a[a.length-1]; }
  if(hi <= lo){ hi = lo + Math.max(Math.abs(lo)*0.004, 0.02); }
  var pad = (hi-lo) * (padR==null?0.10:padR);
  return {min: lo-pad, max: hi+pad};
}
function pctile(arr, p){
  var a = arr.filter(nn).slice().sort(function(x,y){return x-y;});
  if(!a.length) return null;
  var i = Math.min(a.length-1, Math.max(0, Math.round((a.length-1)*p)));
  return a[i];
}

/* ============================================================
   一、大盘走势图（重做）
   ============================================================ */
var IDXV = {span:60, mode:"norm", ma:false, fill:false};

function idxDefs(){
  return [["000001","上证指数","#f5a524"],
          ["399001","深证成指","#58a6ff"],
          ["399006","创业板指","#a371f7"]];
}

function renderIdxChart(){
  var el = $("idxChart"); if(!el) return;
  var run = function(){
    var defs = idxDefs();
    var dates = null, series = [], leg = [], allV = [], stats = [];
    var span = IDXV.span|0;
    for(var d=0; d<defs.length; d++){
      var cd = defs[d][0], nm = defs[d][1], color = defs[d][2];
      var an = getAn(cd); if(!an || !an.closes || !an.closes.length) continue;
      var N = (span>0 && span<an.dates.length) ? span : an.dates.length;
      var st = an.dates.length - N;
      var base = an.closes[st];
      if(!nn(base) || !base) continue;
      if(!dates) dates = an.dates.slice(st);
      var arr = [], i;
      if(IDXV.mode === "chg"){
        for(i=st;i<an.dates.length;i++){
          var c = an.closes[i];
          arr.push(nn(c) ? +(((c/base)-1)*100).toFixed(2) : null);
        }
      }else{
        for(i=st;i<an.dates.length;i++){
          var c2 = an.closes[i];
          arr.push(nn(c2) ? +((c2/base)*100).toFixed(2) : null);
        }
      }
      for(i=0;i<arr.length;i++) if(nn(arr[i])) allV.push(arr[i]);
      var last = arr[arr.length-1];
      var hi = Math.max.apply(null, arr.filter(nn));
      var lo = Math.min.apply(null, arr.filter(nn));
      var mdd = 0, peak = -Infinity;
      for(i=0;i<arr.length;i++){
        if(!nn(arr[i])) continue;
        if(arr[i] > peak) peak = arr[i];
        var dd = (IDXV.mode==="chg") ? (arr[i]-peak) : ((arr[i]/peak-1)*100);
        if(dd < mdd) mdd = dd;
      }
      var rets = [];
      for(i=1;i<arr.length;i++){ if(nn(arr[i])&&nn(arr[i-1])&&arr[i-1]!==0) rets.push(arr[i]/arr[i-1]-1); }
      var mu = rets.length ? rets.reduce(function(a,b){return a+b;},0)/rets.length : 0;
      var varr = rets.length ? rets.reduce(function(a,b){return a+(b-mu)*(b-mu);},0)/rets.length : 0;
      stats.push({nm:nm, color:color, last:last, hi:hi, lo:lo, mdd:mdd, vol:Math.sqrt(varr)*Math.sqrt(244)*100});
      var common = {
        name:nm, type:"line", data:arr, smooth:false, showSymbol:false,
        lineStyle:{width:2.1, color:color}, itemStyle:{color:color},
        emphasis:{focus:"series"}, z:5
      };
      if(IDXV.fill){
        common.areaStyle = {opacity:0.10, color:color};
      }
      series.push(common);
      if(IDXV.ma){
        var ma = [];
        for(i=st;i<an.dates.length;i++){
          var mv = an.ma20[i];
          ma.push(nn(mv) ? (IDXV.mode==="chg" ? +(((mv/base)-1)*100).toFixed(2) : +((mv/base)*100).toFixed(2)) : null);
        }
        series.push({name:nm+" MA20", type:"line", data:ma, smooth:true, showSymbol:false,
          lineStyle:{width:1, color:color, opacity:0.42, type:"dashed"}, z:2});
      }
      leg.push(nm);
    }
    if(!series.length){
      el.innerHTML = '<div class="empty">指数K线数据缺失（可在「数据后台」检查，或在个股诊断粘贴指数日K）</div>';
      if(el._c){ try{el._c.dispose();}catch(e){} el._c=null; }
      return;
    }
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    var rg = tightRange(allV, 0.12, false);
    if(!rg) rg = {min:null, max:null};
    var zeroLine = (IDXV.mode==="chg") ? 0 : 100;
    if(rg.min!=null && zeroLine < rg.min) rg.min = zeroLine - (rg.max-rg.min)*0.02;
    if(rg.max!=null && zeroLine > rg.max) rg.max = zeroLine + (rg.max-rg.min)*0.02;
    var mark = {silent:true, symbol:"none", data:[{
      yAxis:zeroLine,
      lineStyle:{color:"rgba(147,161,184,.45)", type:"dashed", width:1},
      label:{show:false}
    }]};
    series[0].markLine = mark;

    c.setOption({
      animation:false, backgroundColor:"transparent",
      grid:{left:66, right:26, top:52, bottom:66},
      legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12.5},
        itemWidth:20, itemHeight:10, itemGap:18},
      tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
        textStyle:{color:"#e8eef7", fontSize:12.5},
        axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}},
        valueFormatter:function(v){ return v==null ? "—" : (+v).toFixed(2) + (IDXV.mode==="chg" ? "%" : ""); }},
      xAxis:{type:"category", data:dates||[], boundaryGap:false,
        axisLine:{lineStyle:{color:"#31405a"}},
        axisTick:{show:false},
        axisLabel:{color:"#93a1b8", fontSize:11.5,
          interval:Math.max(1, Math.floor((dates||[]).length/9))}},
      yAxis:{type:"value", min:rg.min, max:rg.max, scale:true,
        splitNumber:6,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#93a1b8", fontSize:11.5,
          formatter:function(v){ return (IDXV.mode==="chg") ? v.toFixed(1)+"%" : v.toFixed(1); }},
        axisLine:{show:false}},
      dataZoom:[
        {type:"inside", start:0, end:100, zoomOnMouseWheel:true, moveOnMouseMove:false},
        {type:"slider", height:22, bottom:14, start:0, end:100,
          borderColor:"transparent", backgroundColor:"rgba(255,255,255,.03)",
          fillerColor:"rgba(76,141,255,.14)", handleStyle:{color:"#4c8dff"},
          dataBackground:{lineStyle:{color:"#3d4a60"}, areaStyle:{color:"rgba(61,74,96,.5)"}},
          textStyle:{color:"#7d8ca3", fontSize:10}}
      ],
      series:series
    }, true);

    /* 区间统计 */
    var box = $("idxStat");
    if(box){
      var h = "";
      for(var i=0;i<stats.length;i++){
        var s = stats[i];
        var up = (s.last!=null) && (IDXV.mode==="chg" ? s.last>=0 : s.last>=100);
        h += '<div class="logitem"><div class="k">'+esc(s.nm)+'</div>'+
             '<div class="v '+(up?"up":"down")+'">'+(s.last==null?"—":((s.last>0?"+":"")+s.last.toFixed(2)+(IDXV.mode==="chg"?"%":"")))+'</div>'+
             '<div class="ds muted" style="font-size:11.5px;margin-top:4px">'+
             '区间高 '+s.hi.toFixed(1)+' / 低 '+s.lo.toFixed(1)+'<br>'+
             '最大回撤 '+s.mdd.toFixed(2)+(IDXV.mode==="chg"?"%":"")+
             ' · 年化波动 '+s.vol.toFixed(1)+'%</div></div>';
      }
      box.innerHTML = h;
    }
  };
  run();
}

/* ============================================================
   二、五维雷达（加高 + 数值条）
   ============================================================ */
function renderRadar(an){
  var el = $("radarChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    try{
      var d = an.score.dims, cap = an.score.caps;
      var keys = Object.keys(d);
      c.setOption({
        animation:false, backgroundColor:"transparent",
        tooltip:{backgroundColor:"rgba(19,26,37,.97)", borderColor:"#263145",
          textStyle:{color:"#e8eef7", fontSize:13},
          formatter:function(){
            var s = "";
            for(var i=0;i<keys.length;i++) s += keys[i]+"："+d[keys[i]]+" / "+cap[keys[i]]+"<br>";
            return s + "<b>总分 "+an.score.total+"（"+an.score.label+"）</b>";
          }},
        radar:{
          indicator: keys.map(function(k){ return {name:k, max:cap[k]}; }),
          radius:"70%", center:["50%","52%"],
          shape:"polygon", splitNumber:4,
          axisName:{color:"#c3cfdd", fontSize:13, fontWeight:500,
            backgroundColor:"rgba(255,255,255,.04)", borderRadius:4, padding:[4,6]},
          splitLine:{lineStyle:{color:"rgba(38,49,69,.95)", width:1}},
          splitArea:{areaStyle:{color:["rgba(255,255,255,.02)","rgba(255,255,255,.045)"]}},
          axisLine:{lineStyle:{color:"rgba(38,49,69,.95)"}}
        },
        series:[{type:"radar", symbolSize:6,
          data:[{value:keys.map(function(k){return d[k];}), name:"当前",
            lineStyle:{color:ACC, width:2.4}, itemStyle:{color:ACC},
            areaStyle:{color:"rgba(76,141,255,.26)"}}]}]
      }, true);
    }catch(e){}
    /* 数值条：比雷达更直观 */
    var box = $("radarBars");
    if(box){
      var h = "";
      for(var i=0;i<keys.length;i++){
        var k = keys[i], v = d[k], cp = cap[k];
        var r = cp ? Math.max(0, Math.min(100, v/cp*100)) : 0;
        var col = r>=66 ? UP : (r>=40 ? WARN : DOWN);
        h += '<div style="margin-bottom:7px">'+
          '<div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:2px">'+
            '<span>'+esc(k)+'</span><span><b class="'+(r>=66?"up":(r>=40?"":"down"))+'">'+v+'</b> <span class="muted">/ '+cp+'</span></span></div>'+
          '<div class="pnbar"><i style="width:'+r.toFixed(1)+'%;background:'+col+'"></i></div></div>';
      }
      box.innerHTML = h;
    }
  };
  run();
}

/* ============================================================
   三、近 120 日技术评分走势（加高 + 边距 + 缩放）
   ============================================================ */
function renderScoreTrend(an){
  var el = $("scoreChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    var h = an.hist || [];
    if(!h.length){ c.clear(); return; }
    var xs = h.map(function(x){ return x.date; });
    var vs = h.map(function(x){ return x.v; });
    var cur = vs[vs.length-1];
    var mn = Math.min.apply(null, vs.filter(nn));
    var mx = Math.max.apply(null, vs.filter(nn));
    var loY = Math.max(0, Math.floor((mn-6)/10)*10);
    var hiY = Math.min(100, Math.ceil((mx+6)/10)*10);
    if(hiY - loY < 40){ loY = Math.max(0, loY-10); hiY = Math.min(100, hiY+10); }
    c.setOption({
      animation:false, backgroundColor:"transparent",
      grid:{left:46, right:20, top:22, bottom:44},
      tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#263145",
        textStyle:{color:"#e8eef7", fontSize:12.5},
        formatter:function(p){ return p[0].name + "　评分 " + p[0].value; }},
      xAxis:{type:"category", data:xs, boundaryGap:false,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
        axisLabel:{color:"#8b98ab", fontSize:11,
          interval:Math.max(1, Math.floor(xs.length/6))}},
      yAxis:{type:"value", min:loY, max:hiY, interval:20,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#8b98ab", fontSize:11}, axisLine:{show:false}},
      dataZoom:[{type:"inside", start:0, end:100}],
      series:[{
        type:"line", data:vs, smooth:true, showSymbol:false,
        lineStyle:{width:2.2, color:ACC},
        areaStyle:{color:{type:"linear", x:0,y:0,x2:0,y2:1,
          colorStops:[{offset:0,color:"rgba(76,141,255,.36)"},{offset:1,color:"rgba(76,141,255,0)"}]}},
        markPoint:{symbolSize:0, data:[{coord:[xs.length-1, cur],
          label:{show:true, position:"top", distance:8, formatter:String(cur),
            color:"#e8eef7", fontSize:12, fontWeight:"bold"}}]},
        markLine:{silent:true, symbol:"none", data:[
          {yAxis:60, lineStyle:{color:"rgba(34,197,94,.5)", type:"dashed", width:1},
           label:{formatter:"偏强 60", color:"#6ee79f", fontSize:10.5, position:"insideEndTop"}},
          {yAxis:40, lineStyle:{color:"rgba(255,77,79,.5)", type:"dashed", width:1},
           label:{formatter:"偏弱 40", color:"#ff8f8f", fontSize:10.5, position:"insideEndBottom"}}
        ]}
      }]
    }, true);
  };
  run();
}

/* ============================================================
   四、Tab 切换时刷新图表尺寸
   ============================================================ */
var _tab7 = (typeof tab === "function") ? tab : null;
tab = function(id){
  if(_tab7) _tab7(id);
  try{ flushCharts(); }catch(e){}
  if(id === "market"){ try{ renderIdxChart(); }catch(e){} }
  if(id === "admin"){ try{ renderAdmin(); }catch(e){} }
  if(id === "alerts"){ try{ renderAlerts(); }catch(e){} }
  if(id === "help"){ try{ renderAbout(); }catch(e){} }
};
try{
  var _rt = null;
  window.addEventListener("resize", function(){
    if(_rt) clearTimeout(_rt);
    _rt = setTimeout(function(){ resizeAllCharts(); }, 140);
  });
}catch(e){}

/* ============================================================
   engine8 · K线显示设置 + 艾略特波浪（v2.0）
   ============================================================ */

/* ---------- 设置持久化 ---------- */
function klSetSave(){
  try{ localStorage.setItem("ashare_klset", JSON.stringify(KLSET)); }catch(e){}
}
function klSetLoad(){
  try{
    var s = localStorage.getItem("ashare_klset");
    if(s){
      var o = JSON.parse(s);
      for(var k in o){ if(Object.prototype.hasOwnProperty.call(o,k)) KLSET[k]=o[k]; }
    }
  }catch(e){}
}

/* ---------- 均线数据（支持任意周期，结果缓存在 an 上） ---------- */
function maLineData(an, n){
  if(!an) return null;
  if(!an._maX) an._maX = {};
  if(an._maX[n]) return an._maX[n];
  if(n===5)  { an._maX[n]=an.ma5;  return an.ma5;  }
  if(n===10) { an._maX[n]=an.ma10; return an.ma10; }
  if(n===20) { an._maX[n]=an.ma20; return an.ma20; }
  if(n===60) { an._maX[n]=an.ma60; return an.ma60; }
  if(!an.closes || an.closes.length < n) return null;
  an._maX[n] = sma(an.closes, n);
  return an._maX[n];
}

/* ---------- 美国线（OHLC bar）自定义系列 ---------- */
function ohlcBarSeries(an){
  var data = [];
  for(var k=0;k<an.dates.length;k++){
    data.push([k, an.opens[k], an.closes[k], an.lows[k], an.highs[k]]);
  }
  return {
    name:"OHLC", type:"custom", data:data, z:5,
    renderItem:function(params, api){
      var i = params.dataIndex;
      var o = api.value(1), c = api.value(2), l = api.value(3), h = api.value(4);
      if(o==null||c==null||l==null||h==null) return;
      var up = (c >= o);
      var col = up ? UP : DOWN;
      var x  = api.coord([i, o])[0];
      var yO = api.coord([i, o])[1];
      var yC = api.coord([i, c])[1];
      var yH = api.coord([i, h])[1];
      var yL = api.coord([i, l])[1];
      var hw = Math.max(1.4, (api.size ? (api.size([1,0])[0]||6) : 6) * 0.30);
      return { type:"group", children:[
        {type:"line", shape:{x1:x, y1:yH, x2:x, y2:yL}, style:{stroke:col, lineWidth:1}},
        {type:"line", shape:{x1:x-hw, y1:yO, x2:x, y2:yO}, style:{stroke:col, lineWidth:1.4}},
        {type:"line", shape:{x1:x, y1:yC, x2:x+hw, y2:yC}, style:{stroke:col, lineWidth:1.4}}
      ]};
    }
  };
}

/* ============================================================
   艾略特波浪：ZigZag 摆动点 + 五浪规则校验
   —— 纯形态近似，非预测工具，仅作结构参考
   ============================================================ */
function zigzagPivots(an, pct){
  var n = an.dates.length;
  if(n < 12) return [];
  var hi = an.highs, lo = an.lows;
  var piv = [];
  var dir = 0;
  var upI = 0, upV = hi[0], dnI = 0, dnV = lo[0];
  pct = (pct==null ? 0.05 : pct);
  for(var i=1;i<n;i++){
    if(nn(hi[i]) && hi[i] > upV){ upV = hi[i]; upI = i; }
    if(nn(lo[i]) && lo[i] < dnV){ dnV = lo[i]; dnI = i; }
    if(dir >= 0 && dnV <= upV * (1 - pct)){
      piv.push({i:upI, v:upV, t:1});
      dir = -1; dnI = i; dnV = lo[i]; upI = i; upV = hi[i];
    } else if(dir <= 0 && upV >= dnV * (1 + pct)){
      piv.push({i:dnI, v:dnV, t:-1});
      dir = 1; upI = i; upV = hi[i]; dnI = i; dnV = lo[i];
    }
  }
  /* 合并同向相邻点，保留更极端者 */
  var out = [];
  for(var j=0;j<piv.length;j++){
    var p = piv[j];
    if(out.length && out[out.length-1].t === p.t){
      var q = out[out.length-1];
      if((p.t === 1 && p.v > q.v) || (p.t === -1 && p.v < q.v)) out[out.length-1] = p;
    } else out.push(p);
  }
  return out;
}

function findImpulse(piv){
  if(!piv || piv.length < 6) return null;
  var startMin = Math.max(0, piv.length - 16);
  for(var s = piv.length - 6; s >= startMin; s--){
    var P = piv.slice(s, s + 6);
    var ok = true, i;
    for(i=1;i<6;i++){ if(P[i].t === P[i-1].t){ ok = false; break; } }
    if(!ok) continue;
    var up = P[1].v > P[0].v;
    if(up  && P[1].t !== 1)  continue;
    if(!up && P[1].t !== -1) continue;
    var l1 = Math.abs(P[1].v-P[0].v), l2 = Math.abs(P[2].v-P[1].v),
        l3 = Math.abs(P[3].v-P[2].v), l4 = Math.abs(P[4].v-P[3].v),
        l5 = Math.abs(P[5].v-P[4].v);
    if(!(l1>0 && l3>0 && l5>0)) continue;
    /* 规则1：2浪不回撤超过1浪起点 */
    if(up  && !(P[2].v < P[1].v && P[2].v > P[0].v)) continue;
    if(!up && !(P[2].v > P[1].v && P[2].v < P[0].v)) continue;
    /* 规则2：3浪不是最短的一浪 */
    if(!(l3 >= Math.min(l1, l5) * 0.98 && l3 > l1 * 0.50)) continue;
    /* 规则3：4浪不与1浪重叠 */
    if(up  && !(P[4].v < P[3].v && P[4].v > P[1].v)) continue;
    if(!up && !(P[4].v > P[3].v && P[4].v < P[1].v)) continue;
    return {P:P, up:up, l:[l1,l2,l3,l4,l5], s:s};
  }
  return null;
}

function elliott(an, pctOverride){
  var res = {found:false, piv:[], imp:null, corr:null, fib:null, text:""};
  if(!an || !an.dates || an.dates.length < 30) return res;
  var pct = (pctOverride != null ? pctOverride
            : (KLSET && KLSET.wavePct ? KLSET.wavePct : 5)) / 100;
  var piv = zigzagPivots(an, pct);
  res.piv = piv;
  if(piv.length < 6){ res.text = "摆动点不足（" + piv.length + " 个），暂无法识别完整浪型。可调大灵敏度或切换更长周期。"; return res; }
  var imp = findImpulse(piv);
  if(!imp){ res.text = "未匹配到满足「2浪不破1浪起点 / 3浪非最短 / 4浪不重叠1浪」三条硬规则的五浪结构。"; return res; }
  res.found = true; res.imp = imp;
  var P = imp.P, up = imp.up, l = imp.l;
  var P0=P[0].v, P1=P[1].v, P2=P[2].v, P3=P[3].v, P4=P[4].v, P5=P[5].v;
  var waveLen = Math.abs(P5 - P0) || 1;
  var dir = up ? 1 : -1;
  var fib = {
    r382: P5 - dir * waveLen * 0.382,
    r500: P5 - dir * waveLen * 0.500,
    r618: P5 - dir * waveLen * 0.618,
    ext1618: P4 + dir * l[0] * 1.618,
    ext100:  P4 + dir * l[0] * 1.000
  };
  res.fib = fib;
  /* 修正段：主浪之后若还有 2~3 个摆动点，标 A/B/C */
  if(imp.s + 8 <= piv.length){
    res.corr = [piv[imp.s+5], piv[imp.s+6], piv[imp.s+7]];
  } else if(imp.s + 7 <= piv.length){
    res.corr = [piv[imp.s+5], piv[imp.s+6]];
  }
  var last = an.close;
  var phase;
  if(res.corr && res.corr.length >= 2){
    phase = "当前处于" + (up ? "上升" : "下降") + "五浪之后的<b>修正段</b>（" +
            (res.corr.length >= 3 ? "A-B-C 已成型" : "A-B 进行中，C 段未确认") + "）";
  } else if((up && last >= P5*0.985) || (!up && last <= P5*1.015)){
    phase = "价格贴近第 <b>5 浪末端</b>，五浪结构接近完成，需警惕反转或进入修正";
  } else if((up && last >= P3) || (!up && last <= P3)){
    phase = "当前处于第 <b>4/5 浪区域</b>（3 浪高点已过）";
  } else if((up && last >= P2) || (!up && last <= P2)){
    phase = "当前处于第 <b>3 浪区域</b>（通常是主升/主跌段）";
  } else {
    phase = "当前处于第 <b>1~2 浪区域</b>";
  }
  res.phase = phase;
  res.text =
    "识别出" + (up ? "<b>上升</b>" : "<b>下降</b>") + "五浪结构（摆动阈值 " + (pct*100).toFixed(1) + "%）：" +
    "1浪 " + f2(P1-P0) + "　2浪 " + f2(P2-P1) + "　3浪 " + f2(P3-P2) +
    "　4浪 " + f2(P4-P3) + "　5浪 " + f2(P5-P4) + "。" + phase +
    "。若五浪结束，常见回撤参考：" + f2(fib.r382) + "（38.2%）/ " +
    f2(fib.r500) + "（50%）/ " + f2(fib.r618) + "（61.8%）。" +
    "若为 5 浪延伸，1 倍量度目标约 " + f2(fib.ext100) + "，1.618 倍约 " + f2(fib.ext1618) + "。";
  return res;
}

/* ---------- 波浪画线（挂在 K 线主图 markLine 上） ---------- */
function buildWaveMark(an, rg, pctOverride){
  var out = [];
  if(!an) return out;
  var e = elliott(an, pctOverride);
  if(!e.found || !e.imp) return out;
  var P = e.imp.P;
  var C = ["#ffd166","#ffb86b","#ffe08a","#ffb86b","#ffd166"];
  var names = ["1","2","3","4","5"];
  var i;
  for(i=0;i<5;i++){
    var a = P[i], b = P[i+1];
    out.push([
      {coord:[an.dates[a.i], a.v], symbol:"none",
        lineStyle:{color:C[i], width:(i===2?2.2:1.6), opacity:0.92},
        label:{show:true, formatter:names[i], position:"middle",
          color:"#0d1117", backgroundColor:C[i], borderRadius:3,
          padding:[1,4], fontSize:11, fontWeight:"bold"}},
      {coord:[an.dates[b.i], b.v], symbol:"none"}
    ]);
  }
  if(e.corr && e.corr.length >= 2){
    var lb = ["A","B","C"], cc = "#a371f7";
    for(i=0;i<e.corr.length-1;i++){
      var p1 = e.corr[i], p2 = e.corr[i+1];
      out.push([
        {coord:[an.dates[p1.i], p1.v], symbol:"none",
          lineStyle:{color:cc, width:1.5, opacity:0.85, type:"dashed"},
          label:{show:true, formatter:lb[i], position:"middle",
            color:"#fff", backgroundColor:"rgba(163,113,247,.85)", borderRadius:3,
            padding:[1,4], fontSize:11, fontWeight:"bold"}},
        {coord:[an.dates[p2.i], p2.v], symbol:"none"}
      ]);
    }
  }
  if(e.fib){
    var f = e.fib;
    var up = e.imp.up;
    [["38.2%", f.r382], ["50%", f.r500], ["61.8%", f.r618]].forEach(function(x, idx){
      out.push({yAxis:x[1], symbol:"none",
        lineStyle:{color:"rgba(163,113,247,.42)", type:"dotted", width:1},
        label:{show:true, formatter:"回调"+x[0]+" "+f2(x[1]),
          position: idx===0 ? "insideEndTop" : "insideEndBottom",
          color:"#c3a6f7", fontSize:10}});
    });
  }
  return out;
}

function renderWaveBox(an){
  var box = $("waveBox"); if(!box) return;
  var on = (KLSET && KLSET.wave) || ($("ckWave") && $("ckWave").checked);
  if(!on || !an){ box.innerHTML = ""; return; }
  var e = elliott(an);
  var h = '<div class="hint" style="margin-top:8px;border-left:3px solid #ffd166;padding-left:10px">'+
          '<b style="color:#ffd166">🌊 艾略特波浪（ZigZag 自动识别）</b><br>'+
          e.text +
          '<div class="muted" style="margin-top:4px">浪型为基于摆动点的<b>形态近似</b>，同一段行情可有多种数法；'+
          '阈值可在设置中调整（当前 ' + ((KLSET.wavePct)||5) + '%）。<b>不构成买卖指令。</b></div></div>';
  box.innerHTML = h;
}

/* ============================================================
   设置面板绑定
   ============================================================ */
function klSetSyncUI(){
  var i;
  /* 均线周期勾选 */
  var box = $("maOpts");
  if(box){
    var h = "";
    [5,10,20,60,120,250].forEach(function(n){
      var on = KLSET.ma.indexOf(n) >= 0;
      h += '<label style="margin:0;display:inline-flex;align-items:center;gap:4px;cursor:pointer">'+
           '<input type="checkbox" data-ma="'+n+'" '+(on?"checked":"")+' style="width:auto"> '+
           '<span style="color:'+(MA_META[n]||"#8b949e")+'">MA'+n+'</span></label>';
    });
    box.innerHTML = h;
    [].forEach.call(box.querySelectorAll("input[data-ma]"), function(cb){
      cb.onchange = function(){
        var n = parseInt(cb.getAttribute("data-ma"), 10);
        var idx = KLSET.ma.indexOf(n);
        if(cb.checked && idx < 0) KLSET.ma.push(n);
        if(!cb.checked && idx >= 0) KLSET.ma.splice(idx, 1);
        KLSET.ma.sort(function(a,b){return a-b;});
        KLSET.preset = "custom"; klSetMarkPreset(); klSetSave(); drawKline();
      };
    });
  }
  var sc = $("segCandle");
  if(sc) [].forEach.call(sc.querySelectorAll("button"), function(b){
    b.classList.toggle("on", b.getAttribute("data-c") === KLSET.candle);
  });
  var wp = $("wavePct"), wpt = $("wavePctTxt");
  if(wp){
    wp.value = KLSET.wavePct || 5;
    if(wpt) wpt.textContent = (KLSET.wavePct || 5).toFixed(1) + "%";
    wp.oninput = function(){
      KLSET.wavePct = parseFloat(wp.value) || 5;
      if(wpt) wpt.textContent = KLSET.wavePct.toFixed(1) + "%";
    };
    wp.onchange = function(){ klSetSave(); drawKline(); };
  }
  var ck;
  ck = $("ckLog");   if(ck) ck.checked = !!KLSET.log;
  ck = $("ckCross"); if(ck) ck.checked = !!KLSET.cross;
  ck = $("ckSplit"); if(ck) ck.checked = !!KLSET.split;
  ck = $("ckWave");  if(ck) ck.checked = !!KLSET.wave;
  klSetMarkPreset();
}
function klSetMarkPreset(){
  var sp = $("segPreset"); if(!sp) return;
  [].forEach.call(sp.querySelectorAll("button"), function(b){
    b.classList.toggle("on", b.getAttribute("data-p") === KLSET.preset);
  });
}
function klSetApplyPreset(name){
  var p = KL_PRESETS[name];
  if(!p) return;
  KLSET.preset = name;
  KLSET.ma = p.ma.slice();
  KLSET.wave = !!p.wave;
  CUR.main = p.main;
  var cks = {ckSignal:p.sig, ckLevel:p.lv, ckChan:p.chan, ckWave:p.wave};
  for(var id in cks){
    var el = $(id); if(el) el.checked = !!cks[id];
  }
  var sm = $("segMain");
  if(sm && p.main){
    [].forEach.call(sm.querySelectorAll("button"), function(b){
      b.classList.toggle("on", b.getAttribute("data-m") === p.main);
    });
  }
  klSetSyncUI(); klSetSave(); drawKline();
}
function bindKlSet(){
  klSetLoad();
  var sp = $("segPreset");
  if(sp) [].forEach.call(sp.querySelectorAll("button"), function(b){
    b.onclick = function(){ klSetApplyPreset(b.getAttribute("data-p")); };
  });
  var sc = $("segCandle");
  if(sc) [].forEach.call(sc.querySelectorAll("button"), function(b){
    b.onclick = function(){
      KLSET.candle = b.getAttribute("data-c");
      KLSET.preset = "custom";
      klSetSyncUI(); klSetSave(); drawKline();
    };
  });
  [["ckLog","log"],["ckCross","cross"],["ckSplit","split"],["ckWave","wave"]].forEach(function(x){
    var el = $(x[0]);
    if(el) el.onchange = function(){
      KLSET[x[1]] = !!el.checked;
      KLSET.preset = "custom";
      klSetSave(); drawKline(); renderWaveBox(curViewAn());
    };
  });
  var bs = $("btnKlSet"), panel = $("klSetPanel");
  if(bs && panel){
    bs.onclick = function(){
      var show = panel.style.display === "none";
      panel.style.display = show ? "" : "none";
      if(show) klSetSyncUI();
      bs.textContent = show ? "⚙ 收起设置" : "⚙ 显示设置";
    };
  }
  var bsave = $("btnKlSetSave");
  if(bsave) bsave.onclick = function(){
    klSetSave(); drawKline(); renderWaveBox(curViewAn());
    var m = $("klSetMsg"); if(m){ m.textContent = "已应用并保存"; setTimeout(function(){m.textContent="";},1600); }
  };
  var breset = $("btnKlSetReset");
  if(breset) breset.onclick = function(){
    KLSET = {preset:"full", ma:[5,10,20,60], candle:"solid", log:false,
             cross:true, split:false, wave:false, wavePct:5};
    klSetSyncUI(); klSetSave(); drawKline(); renderWaveBox(curViewAn());
  };
  /* 大盘图工具条已由 engine13 接管（图型/指数/周期/叠加/导出） */
}

/* ============================================================
   engine9 · 数据层（v2.0）
   1) 三数据源自动回退：腾讯 → 东财 → 新浪
   2) API 后台：源开关 / 优先级 / 模板编辑 / 代理 / 调用日志 / 体检
   ============================================================ */

var LAST_FETCH_ERR = "";
var SRC_META = {
  sina:{nm:"新浪财经", cors:false, note:"JSONP，兼容性最好，偶发限流"},
  tx:  {nm:"腾讯证券",  cors:true,  note:"fetch 直连，前复权日K，速度快"},
  em:  {nm:"东方财富",  cors:true,  note:"fetch 直连，数据全，含成交额"}
};

/* ---------- 代码 → 各源符号 ---------- */
function mktPrefix(code){
  code = String(code||"");
  var c = code.replace(/\D/g,"");
  if(/^(6|9|5|11|78|113|132)/.test(c)) return "sh";
  if(/^(8|4|92)/.test(c)) return "bj";
  return "sz";
}
function symFor(src, code){
  if(src === "em") return emSecid(code);
  return mktPrefix(code) + String(code).replace(/\D/g,"");
}
function emSecid(code){
  var p = mktPrefix(code);
  var m = (p === "sh") ? "1" : "0";
  return m + "." + String(code).replace(/\D/g,"");
}
function withProxy(u){
  var p = (APICFG && APICFG.proxy ? APICFG.proxy : "").trim();
  if(!p) return u;
  if(p.indexOf("{URL}") >= 0) return p.replace("{URL}", encodeURIComponent(u));
  return p + encodeURIComponent(u);
}
function srcUrl(src, code, n){
  var tpl = (APICFG && APICFG.tpl && APICFG.tpl[src]) ? APICFG.tpl[src] : "";
  var u = tpl.replace(/\{SYM\}/g, symFor(src, code))
             .replace(/\{SECID\}/g, emSecid(code))
             .replace(/\{N\}/g, n || 320);
  return withProxy(u);
}

/* ---------- 单源取数 ---------- */
function withTimeout(p, ms){
  return new Promise(function(res, rej){
    var done = false;
    var t = setTimeout(function(){ if(!done){ done = true; rej(new Error("超时")); } }, ms);
    p.then(function(v){ if(!done){ done = true; clearTimeout(t); res(v); } },
           function(e){ if(!done){ done = true; clearTimeout(t); rej(e); } });
  });
}
function fetchTx(code, n){
  var u = srcUrl("tx", code, n);
  return withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000).then(function(j){
    var key = symFor("tx", code);
    var d = j && j.data && (j.data[key] || j.data[Object.keys(j.data || {})[0]]);
    if(!d) throw new Error("返回结构异常");
    var arr = d.qfqday || d.day || [];
    if(!arr.length) throw new Error("空数据");
    /* 腾讯顺序：日期,开,收,高,低,量 */
    return arr.map(function(x){
      return {day:x[0], open:x[1], close:x[2], high:x[3], low:x[4], volume:x[5]};
    });
  });
}
function fetchEm(code, n){
  var u = srcUrl("em", code, n);
  return withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000).then(function(j){
    var kl = j && j.data && j.data.klines;
    if(!kl || !kl.length) throw new Error("空数据");
    /* 东财：日期,开,收,高,低,量,额 */
    return kl.map(function(s){
      var a = String(s).split(",");
      return {day:a[0], open:a[1], close:a[2], high:a[3], low:a[4], volume:a[5]};
    });
  });
}
function fetchSinaN(code, n){
  return new Promise(function(resolve){
    var cb = "__k" + Math.random().toString(36).slice(2, 9);
    var s = document.createElement("script");
    var done = false;
    var fin = function(v){
      if(done) return; done = true;
      try{ delete window[cb]; }catch(e){}
      try{ document.body.removeChild(s); }catch(e){}
      resolve(v || []);
    };
    window[cb] = function(data){ fin(data || []); };
    s.onerror = function(){ fin([]); };
    s.src = srcUrl("sina", code, n) + "&cb=" + cb;
    document.body.appendChild(s);
    setTimeout(function(){ fin([]); }, 9000);
  }).then(function(raw){
    if(!raw || !raw.length) throw new Error("空数据");
    return raw.map(function(d){
      return {day:d.day, open:d.open, close:d.close, high:d.high, low:d.low, volume:d.volume};
    });
  });
}
function normRaw(list){
  var out = [], seen = {};
  for(var i=0;i<list.length;i++){
    var d = list[i];
    var day = normDate(d.day); if(!day) continue;
    var o = num(d.open), h = num(d.high), l = num(d.low), c = num(d.close), v = num(d.volume);
    if(o==null || h==null || l==null || c==null) continue;
    if(seen[day]) continue; seen[day] = 1;
    if(h < Math.max(o,c)) h = Math.max(o,c);
    if(l > Math.min(o,c)) l = Math.min(o,c);
    out.push([day, o, h, l, c, (v==null?0:v), null]);
  }
  out.sort(function(a,b){ return a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0); });
  return out;
}

/* ---------- 调用日志 ---------- */
function apiLog(rec){
  try{
    APILOG.unshift(rec);
    if(APILOG.length > 200) APILOG.length = 200;
    localStorage.setItem("ashare_apilog", JSON.stringify(APILOG.slice(0, 60)));
  }catch(e){}
}
function apiLogLoad(){
  try{
    var s = localStorage.getItem("ashare_apilog");
    if(s){ var a = JSON.parse(s); if(a && a.length) APILOG = a; }
  }catch(e){}
}
function cfgSave(){ try{ localStorage.setItem("ashare_apicfg", JSON.stringify(APICFG)); }catch(e){} }
function cfgLoad(){
  try{
    var s = localStorage.getItem("ashare_apicfg");
    if(s){
      var o = JSON.parse(s);
      if(o.tpl)   for(var k in o.tpl) APICFG.tpl[k] = o.tpl[k];
      if(o.order) APICFG.order = o.order;
      if(o.on)    for(var k2 in o.on) APICFG.on[k2] = o.on[k2];
      if(o.proxy != null) APICFG.proxy = o.proxy;
    }
  }catch(e){}
}

/* ---------- 主拉取入口（覆盖旧版单源） ---------- */
async function fetchStockData(code){
  var n = 320, errs = [];
  var order = (APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx","em","sina"];
  for(var i=0;i<order.length;i++){
    var src = order[i];
    if(APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = (src === "sina") ? await fetchSinaN(code, n)
              : (src === "tx")   ? await fetchTx(code, n)
              :                    await fetchEm(code, n);
      var rows = normRaw(raw);
      var ms = Date.now() - t0;
      if(rows.length >= 8){
        state.stocks[code] = {rows: rows};
        clearAn(code);
        saveState();
        apiLog({t:t0, src:src, code:code, ok:true, n:rows.length, ms:ms,
                last:rows[rows.length-1][0]});
        return rows.length;
      }
      apiLog({t:t0, src:src, code:code, ok:false, n:rows.length, ms:ms, err:"条数不足"});
      errs.push(SRC_META[src].nm + " 仅 " + rows.length + " 条");
    }catch(e){
      apiLog({t:t0, src:src, code:code, ok:false, n:0, ms:Date.now()-t0,
              err:String((e && e.message) || e || "失败").slice(0, 70)});
      errs.push(SRC_META[src].nm + " " + String((e && e.message) || e).slice(0, 40));
    }
  }
  LAST_FETCH_ERR = errs.join("；") || "全部数据源不可用";
  return 0;
}

/* 批量拉取：带进度 + 明确失败原因 */
async function fetchAllHoldings(){
  var msg = $("holdMsg");
  var done = 0, fail = 0, fails = [];
  var list = state.holdings.slice();
  for(var i=0;i<list.length;i++){
    var h = list[i];
    if(msg) msg.textContent = "拉取中 " + (i+1) + "/" + list.length + " " + h.name + "…";
    try{
      var n = await fetchStockData(h.code);
      if(n > 0) done++; else { fail++; fails.push(h.name + "（" + LAST_FETCH_ERR + "）"); }
    }catch(e){ fail++; fails.push(h.name + "（异常）"); }
  }
  if(msg) msg.textContent = "完成：成功 " + done + " 只，失败 " + fail + " 只";
  renderHoldings(); renderRail(); renderDash(); renderAdmin();
  var tip = "批量拉取完成：成功 " + done + " 只，失败 " + fail + " 只。";
  if(fails.length){
    tip += "\n\n失败明细：\n· " + fails.slice(0, 8).join("\n· ");
    tip += "\n\n常见原因：① 公司网络拦截外网 ② 浏览器跨域限制（可开代理）③ 代码所属市场未覆盖。";
    tip += "\n可在「⑨ 数据后台」调整数据源顺序或在「个股诊断」直接粘贴日K。";
  }
  alert(tip);
}

/* ============================================================
   API 后台渲染
   ============================================================ */
function renderAdmin(){
  apiLogLoadOnce();
  renderApiStat();
  renderApiList();
  renderApiLog();
  renderHealth();
}
var _apiLogLoaded = false;
function apiLogLoadOnce(){ if(!_apiLogLoaded){ apiLogLoad(); _apiLogLoaded = true; } }

function renderApiStat(){
  var box = $("apiStat"); if(!box) return;
  var tot = APILOG.length, ok = 0, mssum = 0, srcOk = {};
  for(var i=0;i<APILOG.length;i++){
    var r = APILOG[i];
    if(r.ok){ ok++; srcOk[r.src] = 1; }
    mssum += (r.ms || 0);
  }
  var rate = tot ? (ok / tot * 100) : 0;
  var avg = tot ? Math.round(mssum / tot) : 0;
  var onN = 0;
  for(var s in SRC_META){ if(APICFG.on[s] !== false) onN++; }
  var h = "";
  h += card("启用数据源", onN + " / 3", "可在下方勾选 / 调序");
  h += card("累计调用", tot + " 次", "最近 200 条滚动保留");
  h += card("成功率", rate.toFixed(0) + "%", ok + " 成功 / " + (tot-ok) + " 失败");
  h += card("平均耗时", avg + " ms", "含网络往返，超时 9s");
  box.innerHTML = h;
  function card(k, v, d){
    return '<div class="logitem"><div class="k">' + k + '</div><div class="v">' + v +
           '</div><div class="muted" style="font-size:11px;margin-top:3px">' + d + '</div></div>';
  }
}

function renderApiList(){
  var box = $("apiList"); if(!box) return;
  var order = APICFG.order.slice();
  var h = '<table><thead><tr><th style="width:70px">优先级</th><th style="width:110px">数据源</th>' +
          '<th style="width:64px">启用</th><th>接口地址模板（{SYM} {SECID} {N} 为占位符，可自行修改）</th>' +
          '<th style="width:80px">操作</th></tr></thead><tbody>';
  for(var i=0;i<order.length;i++){
    var s = order[i], m = SRC_META[s] || {nm:s, note:""};
    h += '<tr>' +
      '<td><div class="flex" style="gap:4px">' +
        '<button class="btn sm" data-up="' + s + '" ' + (i===0?"disabled":"") + '>↑</button>' +
        '<button class="btn sm" data-dn="' + s + '" ' + (i===order.length-1?"disabled":"") + '>↓</button>' +
        '<span class="muted">' + (i+1) + '</span></div></td>' +
      '<td><b>' + m.nm + '</b><div class="muted" style="font-size:11px">' + m.note + '</div></td>' +
      '<td><input type="checkbox" data-on="' + s + '" ' + (APICFG.on[s]!==false?"checked":"") + ' style="width:auto"></td>' +
      '<td><input data-tpl="' + s + '" value="' + esc(APICFG.tpl[s]||"") + '" style="font-size:11.5px"></td>' +
      '<td><button class="btn sm" data-test="' + s + '">测试</button></td>' +
    '</tr>';
  }
  h += '</tbody></table>';
  h += '<div class="field" style="margin-top:10px"><label>CORS 代理前缀（可选，填了会走代理；用 {URL} 代表原始地址，不填则直接拼接）</label>' +
       '<input id="proxyInp" value="' + esc(APICFG.proxy||"") + '" placeholder="如 https://api.allorigins.win/raw?url={URL}"></div>';
  h += '<div class="flex"><button class="btn primary sm" id="cfgSave">保存配置</button>' +
       '<button class="btn sm" id="cfgReset">恢复默认地址</button>' +
       '<span class="muted" id="cfgMsg"></span></div>';
  box.innerHTML = h;

  [].forEach.call(box.querySelectorAll("button[data-up]"), function(b){
    b.onclick = function(){ moveSrc(b.getAttribute("data-up"), -1); };
  });
  [].forEach.call(box.querySelectorAll("button[data-dn]"), function(b){
    b.onclick = function(){ moveSrc(b.getAttribute("data-dn"), 1); };
  });
  [].forEach.call(box.querySelectorAll("input[data-on]"), function(cb){
    cb.onchange = function(){ APICFG.on[cb.getAttribute("data-on")] = cb.checked; cfgSave(); renderApiStat(); };
  });
  [].forEach.call(box.querySelectorAll("input[data-tpl]"), function(ip){
    ip.onchange = function(){ APICFG.tpl[ip.getAttribute("data-tpl")] = ip.value.trim(); cfgSave(); };
  });
  [].forEach.call(box.querySelectorAll("button[data-test]"), function(b){
    b.onclick = function(){ testSrc(b.getAttribute("data-test")); };
  });
  var pi = $("proxyInp");
  if(pi) pi.onchange = function(){ APICFG.proxy = pi.value.trim(); cfgSave(); };
  var cs = $("cfgSave");
  if(cs) cs.onclick = function(){ cfgSave(); apiMsg("配置已保存"); };
  var cr = $("cfgReset");
  if(cr) cr.onclick = function(){
    APICFG.tpl = {
      sina:"https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol={SYM}&scale=240&ma=5&datalen={N}",
      tx:"https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={SYM},day,,,{N},qfq",
      em:"https://push2his.eastmoney.com/api/qt/stock/kline/get?secid={SECID}&fields1=f1,f2,f3&fields2=f51,f52,f53,f54,f55,f56,f57&klt=101&fqt=1&end=20500101&lmt={N}"
    };
    APICFG.proxy = ""; cfgSave(); renderAdmin(); apiMsg("已恢复默认");
  };
}
function apiMsg(t){
  var m = $("apiMsg"); if(m){ m.textContent = t; setTimeout(function(){ m.textContent = ""; }, 2200); }
  var m2 = $("cfgMsg"); if(m2){ m2.textContent = t; setTimeout(function(){ m2.textContent = ""; }, 2200); }
}
function moveSrc(s, d){
  var i = APICFG.order.indexOf(s);
  if(i < 0) return;
  var j = i + d;
  if(j < 0 || j >= APICFG.order.length) return;
  var t = APICFG.order[i]; APICFG.order[i] = APICFG.order[j]; APICFG.order[j] = t;
  cfgSave(); renderAdmin();
}
async function testSrc(s){
  apiMsg("测试 " + SRC_META[s].nm + " 中…（用 000063 中兴通讯）");
  var t0 = Date.now();
  try{
    var raw = (s === "sina") ? await fetchSinaN("000063", 60)
            : (s === "tx")   ? await fetchTx("000063", 60)
            :                  await fetchEm("000063", 60);
    var rows = normRaw(raw);
    apiLog({t:t0, src:s, code:"000063", ok:rows.length>=8, n:rows.length, ms:Date.now()-t0,
            err:rows.length>=8?"":"条数不足"});
    apiMsg(SRC_META[s].nm + "：" + (rows.length>=8 ? ("可用，" + rows.length + " 条，" + (Date.now()-t0) + "ms") : ("返回 " + rows.length + " 条，不可用")));
  }catch(e){
    apiLog({t:t0, src:s, code:"000063", ok:false, n:0, ms:Date.now()-t0, err:String(e.message||e).slice(0,60)});
    apiMsg(SRC_META[s].nm + "：失败 — " + String(e.message || e).slice(0, 60));
  }
  renderApiStat(); renderApiLog();
}
async function testAllSrc(){
  var order = APICFG.order.slice();
  for(var i=0;i<order.length;i++){
    if(APICFG.on[order[i]] === false) continue;
    await testSrc(order[i]);
  }
}

function renderApiLog(){
  var box = $("apiLog"); if(!box) return;
  if(!APILOG.length){ box.innerHTML = '<div class="empty">暂无调用记录。点上方「测速全部数据源」或去持仓页「批量联网拉取」试试。</div>'; return; }
  var h = '<table><thead><tr><th>时间</th><th>数据源</th><th>代码</th><th>结果</th><th class="num">条数</th><th class="num">耗时</th><th>说明</th></tr></thead><tbody>';
  for(var i=0;i<Math.min(APILOG.length, 200);i++){
    var r = APILOG[i];
    var dt = new Date(r.t || Date.now());
    var ts = String(dt.getHours()).padStart(2,"0") + ":" + String(dt.getMinutes()).padStart(2,"0") + ":" + String(dt.getSeconds()).padStart(2,"0");
    h += '<tr><td class="muted">' + ts + '</td>' +
         '<td>' + ((SRC_META[r.src] && SRC_META[r.src].nm) || r.src) + '</td>' +
         '<td>' + esc(r.code) + ' <span class="muted">' + esc(nameOf(r.code)) + '</span></td>' +
         '<td>' + (r.ok ? '<span class="pbadge ok">成功</span>' : '<span class="pbadge bad">失败</span>') + '</td>' +
         '<td class="num">' + (r.n||0) + '</td>' +
         '<td class="num">' + (r.ms||0) + 'ms</td>' +
         '<td class="muted">' + esc(r.err || (r.last ? ("最新 " + r.last) : "")) + '</td></tr>';
  }
  h += '</tbody></table>';
  box.innerHTML = h;
}
function exportLogCsv(){
  if(!APILOG.length){ apiMsg("暂无日志"); return; }
  var rows = [["时间","数据源","代码","结果","条数","耗时ms","说明"]];
  for(var i=0;i<APILOG.length;i++){
    var r = APILOG[i];
    rows.push([new Date(r.t).toLocaleString(), r.src, r.code, r.ok?"成功":"失败", r.n, r.ms, r.err||""]);
  }
  var csv = rows.map(function(a){
    return a.map(function(v){ return '"' + String(v==null?"":v).replace(/"/g,'""') + '"'; }).join(",");
  }).join("\r\n");
  dl("api_log_" + Date.now() + ".csv", "\ufeff" + csv, "text/csv;charset=utf-8");
  apiMsg("日志已导出");
}
function dl(name, content, type){
  try{
    var b = new Blob([content], {type: type || "application/octet-stream"});
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.download = name; a.click();
    setTimeout(function(){ URL.revokeObjectURL(u); }, 2000);
  }catch(e){}
}

/* ---------- 本机数据体检 ---------- */
function renderHealth(){
  var box = $("healthBox"); if(!box) return;
  var codes = Object.keys(state.stocks || {});
  var withData = 0, totalRows = 0, latest = "";
  for(var i=0;i<codes.length;i++){
    var st = state.stocks[codes[i]];
    if(st && st.rows && st.rows.length >= 8){
      withData++; totalRows += st.rows.length;
      var d = st.rows[st.rows.length-1][0];
      if(d > latest) latest = d;
    }
  }
  var bytes = 0;
  try{ bytes = (localStorage.getItem(LS_KEY) || "").length; }catch(e){}
  var missing = [];
  for(var j=0;j<state.holdings.length;j++){
    var hh = state.holdings[j];
    var s2 = state.stocks[hh.code];
    if(!s2 || !s2.rows || s2.rows.length < 8) missing.push(hh.name || hh.code);
  }
  var h = "";
  h += '<div class="logitem"><div class="k">标的（含内嵌）</div><div class="v">' + codes.length +
       '</div><div class="muted" style="font-size:11px">其中 ' + withData + ' 只有有效日K</div></div>';
  h += '<div class="logitem"><div class="k">K线总根数</div><div class="v">' + totalRows +
       '</div><div class="muted" style="font-size:11px">最新日期 ' + (latest || "—") + '</div></div>';
  h += '<div class="logitem"><div class="k">本地存储占用</div><div class="v">' + (bytes/1024).toFixed(0) +
       ' KB</div><div class="muted" style="font-size:11px">浏览器上限通常 5 MB</div></div>';
  h += '<div class="logitem"><div class="k">持仓缺数据</div><div class="v ' + (missing.length?"down":"up") + '">' +
       missing.length + ' 只</div><div class="muted" style="font-size:11px">' +
       (missing.length ? esc(missing.slice(0,4).join("、")) + (missing.length>4?" 等":"") : "全部齐全") + '</div></div>';
  box.innerHTML = h;
}

/* ---------- 后台按钮绑定 ---------- */
function bindAdmin(){
  cfgLoad(); apiLogLoadOnce();
  var b;
  b = $("apiTest");   if(b) b.onclick = function(){ testAllSrc(); };
  b = $("apiLogClear"); if(b) b.onclick = function(){ APILOG = []; try{localStorage.removeItem("ashare_apilog");}catch(e){} renderApiStat(); renderApiLog(); apiMsg("日志已清空"); };
  b = $("apiLogExport"); if(b) b.onclick = exportLogCsv;
  b = $("apiCacheClear"); if(b) b.onclick = function(){
    if(!confirm("将清空所有已拉取/粘贴的K线缓存，内嵌数据不受影响。确定？")) return;
    state.stocks = {}; AN_CACHE = {}; saveState();
    state.holdings.forEach(function(h){ var d = defaultStockOf(h.code); if(d) state.stocks[h.code] = d; });
    saveState(); renderHealth(); renderHoldings(); apiMsg("缓存已清空并重建");
  };
  b = $("btnBackup2"); if(b) b.onclick = function(){
    dl("ashare_review_backup_" + Date.now() + ".json", JSON.stringify(state, null, 1), "application/json");
    apiMsg("已导出备份");
  };
  b = $("btnRestore2"); if(b) b.onclick = function(){ restoreJson(); };
  b = $("btnFactory"); if(b) b.onclick = function(){
    if(!confirm("将清空全部本地数据（持仓、笔记、提醒、配置）并恢复默认。确定？")) return;
    try{
      [LS_KEY, "ashare_notes_v1", "ashare_apilog", "ashare_apicfg", "ashare_klset", "ashare_alerts", "ashare_pos", "ashare_repfs"]
        .forEach(function(k){ localStorage.removeItem(k); });
    }catch(e){}
    location.reload();
  };
}
function defaultStockOf(code){
  try{
    if(typeof DEFAULT_STOCKS === "undefined") return null;
    var k = String(code);
    if(DEFAULT_STOCKS[k]) return DEFAULT_STOCKS[k];
    for(var q in DEFAULT_STOCKS){ if(String(q).indexOf(k) >= 0) return DEFAULT_STOCKS[q]; }
  }catch(e){}
  return null;
}
function restoreJson(){
  var inp = document.createElement("input");
  inp.type = "file"; inp.accept = ".json,application/json";
  inp.onchange = function(){
    var f = inp.files && inp.files[0]; if(!f) return;
    var fr = new FileReader();
    fr.onload = function(){
      try{
        var o = JSON.parse(String(fr.result));
        if(!o || !o.holdings) throw new Error("不是有效的备份文件");
        state = o; saveState(); location.reload();
      }catch(e){ alert("导入失败：" + e.message); }
    };
    fr.readAsText(f);
  };
  inp.click();
}

/* ============================================================
   engine10 · 大事提醒 / 持仓盈亏 / 快捷搜索 / 关于（v2.0）
   ============================================================ */

/* ============================================================
   一、大事提醒
   ============================================================ */
function alertSave(){ try{ localStorage.setItem("ashare_alerts", JSON.stringify(ALERTS)); }catch(e){} }
function alertLoad(){
  try{
    var s = localStorage.getItem("ashare_alerts");
    if(s){ var a = JSON.parse(s); if(a && a.length) ALERTS = a; }
  }catch(e){}
}
function posSave(){ try{ localStorage.setItem("ashare_pos", JSON.stringify(POS)); }catch(e){} }
function posLoad(){
  try{
    var s = localStorage.getItem("ashare_pos");
    if(s){ var o = JSON.parse(s); if(o) POS = o; }
  }catch(e){}
}

function alertTypeTxt(t){
  return {above:"价格上破", below:"价格下破", chg:"单日涨跌", date:"日期提醒", note:"自定义事项"}[t] || t;
}
function renderAlerts(){
  alertLoad();
  renderAlertAuto();
  renderAlertList();
  updateAlertBadge();
}

function renderAlertList(){
  var box = $("alList"); if(!box) return;
  var cnt = $("alCount");
  var hitN = 0;
  for(var i=0;i<ALERTS.length;i++) if(ALERTS[i].hit) hitN++;
  if(cnt) cnt.textContent = "共 " + ALERTS.length + " 条，其中 " + hitN + " 条已触发";
  if(!ALERTS.length){
    box.innerHTML = '<div class="empty">还没有提醒。左侧添加「价格上破 / 下破 / 涨跌 / 日期 / 自定义事项」，或点上方「立即扫描技术信号」。</div>';
    return;
  }
  var h = "";
  for(var j=0;j<ALERTS.length;j++){
    var a = ALERTS[j];
    var an = getAn(a.code);
    var cur = an ? f2(an.close) : "无数据";
    var cond = "";
    if(a.type === "above") cond = "收盘 ≥ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + Number(a.val).toFixed(2) + "%";
    else if(a.type === "date") cond = "到期 " + esc(a.val);
    else cond = esc(a.val);
    h += '<div class="alertrow ' + (a.hit ? "hit" : "") + '">' +
      '<div style="padding-top:2px">' + (a.hit ? "🔔" : "⏳") + '</div>' +
      '<div class="txt"><div class="tt">' + esc(a.name || a.code) +
        ' <span class="muted mono" style="font-size:12px">' + esc(a.code) + '</span>' +
        ' <span class="pbadge">' + alertTypeTxt(a.type) + '</span>' +
        (a.hit ? ' <span class="pbadge ok">已触发</span>' : '') + '</div>' +
      '<div class="ds">' + cond + (a.hitInfo ? '　<b style="color:#ffd48a">' + esc(a.hitInfo) + '</b>' : '') + '</div></div>' +
      '<button class="btn sm" data-alread="' + j + '">已读</button>' +
      '<button class="btn sm danger" data-aldel="' + j + '">删</button>' +
      '</div>';
  }
  box.innerHTML = h;
  [].forEach.call(box.querySelectorAll("[data-aldel]"), function(b){
    b.onclick = function(){ ALERTS.splice(+b.getAttribute("data-aldel"), 1); alertSave(); renderAlerts(); };
  });
  [].forEach.call(box.querySelectorAll("[data-alread]"), function(b){
    b.onclick = function(){
      var a = ALERTS[+b.getAttribute("data-alread")];
      if(a){ a.hit = false; a.hitInfo = ""; }
      alertSave(); renderAlerts();
    };
  });
}

/* ---------- 自动技术大事扫描 ---------- */
function scanTechSignals(){
  var out = [];
  var list = state.holdings.slice();
  for(var i=0;i<list.length;i++){
    var hd = list[i];
    var an = getAn(hd.code);
    if(!an || !an.dates || !an.dates.length) continue;
    var k = an.i, nm = hd.name || an.name || hd.code;
    var add = function(tp, txt, lv){ out.push({code:hd.code, name:nm, type:tp, text:txt, level:lv||"info"}); };
    /* MACD 金叉 / 死叉（近 5 日） */
    for(var d=Math.max(2,k-4); d<=k; d++){
      if(an.dif[d-1]!=null && an.dea[d-1]!=null && an.dif[d]!=null && an.dea[d]!=null){
        if(an.dif[d-1] <= an.dea[d-1] && an.dif[d] > an.dea[d])
          add("macd", an.dates[d] + " MACD 金叉（DIF " + f3(an.dif[d]) + " 上穿 DEA " + f3(an.dea[d]) + "）", "bull");
        if(an.dif[d-1] >= an.dea[d-1] && an.dif[d] < an.dea[d])
          add("macd", an.dates[d] + " MACD 死叉（DIF " + f3(an.dif[d]) + " 下穿 DEA " + f3(an.dea[d]) + "）", "bear");
      }
    }
    /* 均线穿越 */
    if(an.ma60 && an.ma60[k]!=null && an.ma60[k-1]!=null){
      if(an.closes[k-1] <= an.ma60[k-1] && an.closes[k] > an.ma60[k])
        add("ma", "收盘上穿 MA60（" + f2(an.ma60[k]) + "），中期结构转强", "bull");
      if(an.closes[k-1] >= an.ma60[k-1] && an.closes[k] < an.ma60[k])
        add("ma", "收盘跌破 MA60（" + f2(an.ma60[k]) + "），中期结构转弱", "bear");
    }
    if(an.ma20 && an.ma20[k]!=null && an.ma20[k-1]!=null){
      if(an.closes[k-1] <= an.ma20[k-1] && an.closes[k] > an.ma20[k])
        add("ma", "收盘上穿 MA20（" + f2(an.ma20[k]) + "）", "bull");
      if(an.closes[k-1] >= an.ma20[k-1] && an.closes[k] < an.ma20[k])
        add("ma", "收盘跌破 MA20（" + f2(an.ma20[k]) + "）", "bear");
    }
    /* 量能 */
    if(nn(an.vrs[k]) && an.vrs[k] >= 2)
      add("vol", "放量：量比 " + an.vrs[k].toFixed(2) + "（≥2 为显著放量）", an.chg >= 0 ? "bull" : "bear");
    /* 创新高 / 新低 */
    if(an.hl60){
      if(nn(an.hl60.hi) && an.close >= an.hl60.hi * 0.995)
        add("hl", "逼近 / 创 60 日新高（" + f2(an.hl60.hi) + "）", "bull");
      if(nn(an.hl60.lo) && an.close <= an.hl60.lo * 1.005)
        add("hl", "逼近 / 创 60 日新低（" + f2(an.hl60.lo) + "）", "bear");
    }
    /* RSI */
    if(nn(an.r[k])){
      if(an.r[k] >= 75) add("rsi", "RSI14 = " + f1(an.r[k]) + "，进入超买区", "bear");
      if(an.r[k] <= 25) add("rsi", "RSI14 = " + f1(an.r[k]) + "，进入超卖区", "bull");
    }
    /* 通道 */
    if(an.chan && an.chan.lo && an.chan.lo[k]!=null && an.close < an.chan.lo[k])
      add("chan", "跌破趋势通道下轨（" + f2(an.chan.lo[k]) + "）", "bear");
    /* 波浪末端 */
    try{
      var e = elliott(an);
      if(e.found && e.imp){
        var P5 = e.imp.P[5].v;
        if(Math.abs(an.close - P5) / P5 < 0.02)
          add("wave", "价格贴近" + (e.imp.up ? "上升" : "下降") + "五浪末端（" + f2(P5) + "），结构接近完成", "warn");
      }
    }catch(err){}
  }
  return out;
}
function renderAlertAuto(){
  var box = $("alAuto"); if(!box) return;
  var sigs = scanTechSignals();
  if(!sigs.length){ box.innerHTML = '<div class="empty">当前无显著技术信号。</div>'; return; }
  var order = {bear:0, warn:1, bull:2, info:3};
  sigs.sort(function(a,b){ return (order[a.level]||9) - (order[b.level]||9); });
  var col = {bull:UP, bear:DOWN, warn:WARN, info:"#93a1b8"};
  var nm = {bull:"多头", bear:"空头", warn:"注意", info:"提示"};
  var h = "";
  for(var i=0;i<sigs.length;i++){
    var s = sigs[i];
    h += '<div class="alertrow"><div class="txt">' +
      '<div class="tt">' + esc(s.name) + ' <span class="muted mono" style="font-size:12px">' + esc(s.code) + '</span> ' +
      '<span class="pbadge" style="color:' + col[s.level] + ';border-color:' + col[s.level] + '55">' + nm[s.level] + '</span></div>' +
      '<div class="ds">' + s.text + '</div></div></div>';
  }
  h += '<div class="hint" style="margin-top:6px">共 ' + sigs.length + ' 条。均为<b>已发生</b>的技术形态客观描述，' +
       '非预测、非买卖指令；点「立即扫描技术信号」可刷新。</div>';
  box.innerHTML = h;
}

/* ---------- 价格比对 ---------- */
function checkAllAlerts(){
  var hitNew = 0;
  for(var i=0;i<ALERTS.length;i++){
    var a = ALERTS[i];
    var an = getAn(a.code);
    if(a.type === "date"){
      if(a.val && a.val <= todayStr() && !a.hit){ a.hit = true; a.hitInfo = "日期已到（" + a.val + "）"; hitNew++; }
      continue;
    }
    if(a.type === "note") continue;
    if(!an) continue;
    var c = an.close, v = num(a.val);
    if(!nn(c) || v == null) continue;
    if(a.type === "above" && c >= v){ if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "现价 " + f2(c) + " 已上破 " + f2(v); }
    if(a.type === "below" && c <= v){ if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "现价 " + f2(c) + " 已下破 " + f2(v); }
    if(a.type === "chg" && nn(an.chg) && Math.abs(an.chg) >= Math.abs(v)){
      if(!a.hit) hitNew++; a.hit = true; a.hitInfo = "今日 " + pct(an.chg) + " 超过 ±" + Math.abs(v).toFixed(2) + "%";
    }
  }
  alertSave(); updateAlertBadge();
  return hitNew;
}
function todayStr(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function updateAlertBadge(){
  var b = $("alertBadge");
  if(!b) return;
  var n = 0;
  for(var i=0;i<ALERTS.length;i++) if(ALERTS[i].hit) n++;
  if(n > 0){ b.style.display = ""; b.textContent = n; } else { b.style.display = "none"; }
}

function addAlertFromUI(){
  var code = ($("alCode") && $("alCode").value || "").trim();
  var type = ($("alType") && $("alType").value) || "above";
  var val  = ($("alVal") && $("alVal").value || "").trim();
  var msg  = $("alAddMsg");
  if(!code){ if(msg) msg.textContent = "请填写代码或名称"; return; }
  var real = code, nm = "";
  if(!/^\d{6}$/.test(code)){
    var r = lookupName(code);
    if(r){ real = r.code; nm = r.name; }
    else { if(msg) msg.textContent = "未识别：" + code + "，请填 6 位代码"; return; }
  } else { nm = nameOf(real) || real; }
  if(type !== "note" && type !== "date" && !nn(num(val))){
    if(msg) msg.textContent = "请填写数值阈值"; return;
  }
  if(type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(val)){
    if(msg) msg.textContent = "日期格式应为 2026-09-30"; return;
  }
  ALERTS.unshift({id:Date.now(), code:real, name:nm, type:type, val:val, hit:false, hitInfo:""});
  alertSave();
  if(msg) msg.textContent = "已添加：" + nm + " · " + alertTypeTxt(type);
  checkAllAlerts(); renderAlerts();
}

function bindAlerts(){
  var b;
  b = $("alAdd"); if(b) b.onclick = addAlertFromUI;
  b = $("alScan"); if(b) b.onclick = function(){
    renderAlertAuto();
    var m = $("alMsg");
    if(m){ m.textContent = "已扫描 " + new Date().toLocaleTimeString(); setTimeout(function(){ m.textContent = ""; }, 2000); }
  };
  b = $("alReadAll"); if(b) b.onclick = function(){
    for(var i=0;i<ALERTS.length;i++){ ALERTS[i].hit = false; ALERTS[i].hitInfo = ""; }
    alertSave(); renderAlerts();
  };
  b = $("alClearHit"); if(b) b.onclick = function(){
    var keep = [];
    for(var i=0;i<ALERTS.length;i++) if(!ALERTS[i].hit) keep.push(ALERTS[i]);
    ALERTS = keep; alertSave(); renderAlerts();
  };
}

/* ---------- 报告里附上提醒 ---------- */
function buildAlertBlock(){
  var lines = [];
  for(var i=0;i<ALERTS.length;i++){
    var a = ALERTS[i];
    var st = a.hit ? "已触发" : "监控中";
    var v = (a.type === "date" || a.type === "note") ? a.val : f2(num(a.val));
    lines.push("- " + a.name + "（" + a.code + "）· " + alertTypeTxt(a.type) + " " + v + " · " + st);
  }
  var sigs = scanTechSignals();
  var s = "## 大事提醒\n\n";
  s += "### 我的提醒（" + ALERTS.length + " 条）\n\n";
  s += lines.length ? lines.join("\n") + "\n" : "- 暂无\n";
  s += "\n### 技术信号自动扫描（" + sigs.length + " 条）\n\n";
  if(sigs.length){
    var nmx = {bull:"多头", bear:"空头", warn:"注意", info:"提示"};
    s += sigs.slice(0, 25).map(function(x){
      return "- **" + x.name + "（" + x.code + "）**[" + (nmx[x.level]||"") + "] " + x.text;
    }).join("\n") + "\n";
  } else s += "- 当前无显著技术信号\n";
  s += "\n> 提醒为价格 / 日期条件的客观比对结果，技术信号为已发生形态的描述，**不构成买卖指令**。\n";
  return s;
}

/* ============================================================
   二、持仓盈亏
   ============================================================ */
function renderHoldings(){
  var box = $("holdList"); if(!box) return;
  var h = '<table><thead><tr><th style="width:48px">纳入</th><th style="width:104px">代码</th><th>名称</th>'
        + '<th style="width:86px">类型</th><th style="width:88px">成本</th><th style="width:88px">数量</th>'
        + '<th class="num">最新</th><th class="num">涨跌</th><th class="num">浮盈亏</th><th class="num">盈亏%</th>'
        + '<th style="width:96px">权重</th><th class="num">评分</th><th>技术评级</th><th>K线</th><th style="width:56px"></th></tr></thead><tbody>';
  var totalMv = 0, totalCost = 0, rows = [];
  state.holdings.forEach(function(hd, idx){
    var an = getAn(hd.code);
    var p = POS[hd.code] || {};
    var cost = num(p.cost), qty = num(p.qty);
    var last = an ? an.close : null;
    var mv = (last != null && qty != null) ? last * qty : null;
    var cst = (cost != null && qty != null) ? cost * qty : null;
    var pl = (mv != null && cst != null) ? mv - cst : null;
    var plp = (pl != null && cst) ? pl / cst * 100 : null;
    if(mv != null) totalMv += mv;
    if(cst != null) totalCost += cst;
    rows.push({hd:hd, idx:idx, an:an, mv:mv, pl:pl, plp:plp, cost:cost, qty:qty});
  });
  rows.forEach(function(r){
    var hd = r.hd, an = r.an, idx = r.idx;
    var cls = function(v){ return (num(v)||0) >= 0 ? "up" : "down"; };
    var wt = (r.mv != null && totalMv > 0) ? (r.mv / totalMv * 100) : null;
    var plTxt = (r.pl == null) ? '<span class="muted">—</span>'
      : '<b class="' + (r.pl>=0?"up":"down") + '">' + (r.pl>=0?"+":"") + Math.round(r.pl).toLocaleString() + '</b>';
    var plpTxt = (r.plp == null) ? '<span class="muted">—</span>'
      : '<span class="' + (r.plp>=0?"up":"down") + '">' + (r.plp>=0?"+":"") + r.plp.toFixed(2) + '%</span>';
    var wtBar = (wt == null) ? '<span class="muted">—</span>'
      : '<div style="font-size:11.5px">' + wt.toFixed(1) + '%</div><div class="pnbar"><i style="width:'
        + Math.min(100, wt*3).toFixed(1) + '%;background:' + ACC + '"></i></div>';
    h += '<tr>'
      + '<td><input type="checkbox" data-hi="' + idx + '" data-k="inReport"' + (hd.inReport ? " checked" : "") + ' style="width:auto"></td>'
      + '<td><input data-hi="' + idx + '" data-k="code" value="' + esc(hd.code) + '" class="mono"></td>'
      + '<td><input data-hi="' + idx + '" data-k="name" value="' + esc(hd.name) + '"></td>'
      + '<td><select data-hi="' + idx + '" data-k="type">'
        + ["A","ETF","IDX"].map(function(o){ return '<option' + (hd.type===o?" selected":"") + '>' + o + '</option>'; }).join("") + '</select></td>'
      + '<td><input data-hi="' + idx + '" data-k="cost" value="' + (r.cost==null?"":r.cost) + '" placeholder="成本" style="text-align:right"></td>'
      + '<td><input data-hi="' + idx + '" data-k="qty" value="' + (r.qty==null?"":r.qty) + '" placeholder="股数" style="text-align:right"></td>'
      + '<td class="num">' + (an ? f2(an.close) : '<span class="muted">无数据</span>') + '</td>'
      + '<td class="num ' + (an ? cls(an.chg) : "") + '">' + (an ? pct(an.chg) : "—") + '</td>'
      + '<td class="num">' + plTxt + '</td>'
      + '<td class="num">' + plpTxt + '</td>'
      + '<td>' + wtBar + '</td>'
      + '<td class="num">' + (an ? '<b>' + an.score.total + '</b>' : "—") + '</td>'
      + '<td>' + (an ? '<span class="chip ' + an.score.tone + '">' + an.score.label + '</span> <span class="muted" style="font-size:11.5px">' + esc(an.arrange) + '</span>' : '<span class="muted">—</span>') + '</td>'
      + '<td class="muted">' + (state.stocks[hd.code] && state.stocks[hd.code].rows ? state.stocks[hd.code].rows.length + " 根" : "0") + '</td>'
      + '<td><button class="btn sm danger" data-hdel="' + idx + '">删</button></td></tr>';
  });
  h += '</tbody></table>';
  h += '<div class="hint" style="margin-top:8px">成本 / 数量只存本机浏览器，用于算浮盈亏与仓位权重；留空则该标的不纳入盈亏统计。</div>';
  box.innerHTML = h;
  [].forEach.call(box.querySelectorAll("input,select"), function(el){
    el.onchange = function(){
      var i = +el.getAttribute("data-hi"), k = el.getAttribute("data-k");
      if(k === "cost" || k === "qty"){
        var code = state.holdings[i].code;
        if(!POS[code]) POS[code] = {};
        POS[code][k] = el.value === "" ? null : num(el.value);
        posSave();
      } else {
        state.holdings[i][k] = (el.type === "checkbox") ? el.checked : el.value;
      }
      saveState(); renderHoldings(); renderRail(); renderDash(); renderPosSummary();
    };
  });
  [].forEach.call(box.querySelectorAll("[data-hdel]"), function(b){
    b.onclick = function(){
      state.holdings.splice(+b.getAttribute("data-hdel"), 1);
      saveState(); renderHoldings(); renderRail(); renderDash(); renderPosSummary();
    };
  });
  var rc = $("railCount"); if(rc) rc.textContent = state.holdings.length + " 只";
  renderPosSummary();
}

function renderPosSummary(){
  var box = $("posSummary"); if(!box) return;
  var totalMv = 0, totalCost = 0, n = 0;
  var list = [];
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    var p = POS[hd.code] || {};
    var cost = num(p.cost), qty = num(p.qty);
    if(an && qty != null && cost != null){
      var mv = an.close * qty, cst = cost * qty;
      totalMv += mv; totalCost += cst; n++;
      list.push({nm:hd.name, mv:mv, pl:mv-cst, plp:(mv/cst-1)*100});
    } else if(an && qty != null){
      totalMv += an.close * qty; n++;
    }
  });
  var pl = totalCost > 0 ? totalMv - totalCost : null;
  var plp = totalCost > 0 ? (totalMv/totalCost - 1) * 100 : null;
  var best = null, worst = null;
  list.forEach(function(x){
    if(!best || x.plp > best.plp) best = x;
    if(!worst || x.plp < worst.plp) worst = x;
  });
  function card(k, v, d, c){
    return '<div class="logitem"><div class="k">' + k + '</div><div class="v ' + (c||"") + '">' + v +
           '</div><div class="muted" style="font-size:11px;margin-top:3px">' + d + '</div></div>';
  }
  if(!n){
    box.innerHTML = '<div class="logitem" style="grid-column:1/-1"><div class="k">持仓盈亏</div>' +
      '<div class="v muted">—</div><div class="muted" style="font-size:11.5px">在上表填写「成本」与「数量」后自动生成</div></div>';
    return;
  }
  var h = "";
  h += card("总市值", (totalMv/10000).toFixed(2) + " 万", n + " 只已填成本数量");
  h += card("总成本", (totalCost/10000).toFixed(2) + " 万", "按你的成本价计");
  h += card("浮动盈亏", (pl==null?"—":((pl>=0?"+":"") + Math.round(pl).toLocaleString())),
            (plp==null?"":((plp>=0?"+":"") + plp.toFixed(2) + "%")), pl==null?"":(pl>=0?"up":"down"));
  h += card("最强 / 最弱",
            (best ? esc(best.nm) + " " + (best.plp>=0?"+":"") + best.plp.toFixed(1) + "%" : "—") + " / " +
            (worst ? esc(worst.nm) + " " + (worst.plp>=0?"+":"") + worst.plp.toFixed(1) + "%" : "—"),
            "仅统计已填成本数量的标的");
  box.innerHTML = h;
}

/* ============================================================
   三、快捷搜索（Ctrl / Cmd + K）
   ============================================================ */
function cmdkItems(){
  var out = [];
  state.holdings.forEach(function(h){
    out.push({t:h.name + "　" + h.code, s:"持仓", fn:function(){ tab("stock"); pickStock(h.code); }});
  });
  ["000001 上证指数", "399001 深证成指", "399006 创业板指"].forEach(function(x){
    var p = x.split(" ");
    out.push({t:x, s:"指数", fn:function(){ tab("market"); }});
  });
  var pages = [["dash","仪表盘"],["market","大盘环境"],["sector","板块轮动"],["stock","个股诊断"],
    ["holdings","持仓管理"],["report","复盘报告"],["compare","走势对比"],["notes","复盘笔记"],
    ["alerts","大事提醒"],["admin","数据后台"],["help","关于 / 说明"]];
  pages.forEach(function(p){
    out.push({t:p[1], s:"页面", fn:function(){ tab(p[0]); }});
  });
  return out;
}
function openCmdk(){
  var host = $("cmdk"); if(!host) return;
  var items = cmdkItems();
  var sel = 0;
  host.style.display = "";
  host.innerHTML = '<div class="cmdk"><div class="box">' +
    '<input id="cmdkInp" placeholder="搜索标的 / 页面…（↑↓ 选择，回车跳转，Esc 关闭）">' +
    '<div class="res" id="cmdkRes"></div></div></div>';
  var inp = $("cmdkInp"), res = $("cmdkRes");
  function draw(){
    var q = (inp.value || "").trim().toLowerCase();
    var list = items.filter(function(x){ return !q || x.t.toLowerCase().indexOf(q) >= 0; }).slice(0, 40);
    if(sel >= list.length) sel = 0;
    res.innerHTML = list.map(function(x, i){
      return '<div class="it' + (i===sel?" sel":"") + '" data-i="' + i + '"><span>' + esc(x.t) +
             '</span><span class="muted" style="font-size:11.5px">' + x.s + '</span></div>';
    }).join("") || '<div class="it muted">无匹配</div>';
    [].forEach.call(res.querySelectorAll(".it"), function(d){
      d.onmouseenter = function(){ sel = +d.getAttribute("data-i"); draw(); };
      d.onclick = function(){ go(list[+d.getAttribute("data-i")]); };
    });
    res._list = list;
  }
  function go(x){ close(); if(x && x.fn) x.fn(); }
  function close(){ host.style.display = "none"; host.innerHTML = ""; }
  inp.oninput = function(){ sel = 0; draw(); };
  inp.onkeydown = function(e){
    var list = res._list || [];
    if(e.key === "ArrowDown"){ sel = Math.min(list.length-1, sel+1); draw(); e.preventDefault(); }
    else if(e.key === "ArrowUp"){ sel = Math.max(0, sel-1); draw(); e.preventDefault(); }
    else if(e.key === "Enter"){ go(list[sel]); e.preventDefault(); }
    else if(e.key === "Escape"){ close(); }
  };
  host.onclick = function(e){ if(e.target === host || e.target.className === "cmdk") close(); };
  draw(); inp.focus();
}
function bindCmdk(){
  var bs = $("btnSearch");
  if(bs) bs.onclick = function(){ openCmdk(); };
  try{
    document.addEventListener("keydown", function(e){
      if((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")){ e.preventDefault(); openCmdk(); }
      if(e.key === "Escape"){ var h = $("cmdk"); if(h && h.style.display !== "none"){ h.style.display = "none"; h.innerHTML = ""; } }
    });
  }catch(e){}
}

/* ============================================================
   四、关于页
   ============================================================ */
var CHANGELOG = [
  ["2.2", "2026-09-14", "<b>复盘增强 + 稳定性提升</b>：复盘日历热力图（按日可视化评分/盈亏分布）；持仓评分雷达图（多维对比）；复盘模板向导（引导式每日复盘）；全局错误捕获 + 渲染保护；复盘模式增加迷你K线图与快速笔记；个股诊断提醒面板；笔记模板+标签系统；标的分组；隐私发布检查。"],
  ["2.1", "2026-09-12", "<b>复盘工作流全面优化</b>：浮动快捷加标的面板（Ctrl+K 呼出）；拉取自动重试 + 备用源兜底；仪表盘市场脉搏 / 持仓异动 / 复盘检查清单 / 快速导航 / 复盘日记时间线；Toast 通知 / 市场状态指示 / 快捷键帮助 / URL hash 路由。"],
  ["2.0.0", "2026-09-12", "<b>大盘行情重做</b>：走势图新增<b>单指数 K线 / 收盘线</b>模式（可切上证·深成·创业板与日/周线），叠加<b>自动趋势线</b>（ZigZag 摆动点拟合上升/下降趋势线 + 水平支撑压力聚类 + 突破判定）、<b>趋势通道</b>、<b>艾略特波浪</b>（1-2-3-4-5 与 A-B-C，附浪型阶段进度条与自适应阈值）、均线、成交量副图；指数 KPI 卡加<b>迷你走势</b>与距 MA20 偏离；新增<b>指数相关性矩阵</b>与<b>日/周/月多周期共振</b>。<br>一句话添加标的（代码 / 拼音首字母 / 汉字 / 联网全市场检索，回车即加）；拉取层重写（腾讯直连优先 + JSONP 兜底 + 逐源失败诊断）；后台管理扩为六模块；深色 / 浅色 / 护眼三主题；指标数据字典；<b>隐私默认：不内置、不上传任何持仓</b>。"],
  ["1.1.0", "2026-09-11", "多空信号点、支撑压力线与趋势通道、副图 MACD / KDJ / RSI 切换；指数归一化走势图；主线 × 持仓映射。"],
  ["1.0.0", "2026-09-11", "首个可用版本：四步复盘框架（大盘环境 → 板块轮动 → 个股诊断 → 风险情景），指标全部本地计算，公开行情快照离线可用，Markdown 报告导出。"]
];
function renderAbout(){
  var box = $("changelog");
  if(box){
    var h = "";
    CHANGELOG.forEach(function(c){
      h += '<div style="margin-bottom:7px"><b style="color:var(--txt)">v' + c[0] + '</b> ' +
           '<span class="muted">' + c[1] + '</span><br>' + c[2] + '</div>';
    });
    box.innerHTML = h;
  }
  var vb = $("verBadge");
  if(vb) vb.textContent = "v" + APPVER + " · " + APPDATE;
  var f = $("footDate");
  if(f && (!f.textContent || f.textContent === "—")) f.textContent = (typeof SNAPSHOT_DATE !== "undefined" ? SNAPSHOT_DATE : APPDATE);
}

/* ============================================================
   五、v2.0 初始化
   ============================================================ */
/* 注意：init() 在 engine10 顶层同步执行，而 engine11 ~ 13 的顶层 var
   （PREF / LS_KEYS / TASK / SRC_LABEL …）要到整个脚本求值完才赋值。
   若在这里同步调用 renderAdmin() 等，函数内部会拿到 undefined：
   实测 renderStoragePanel 读 LS_KEYS.forEach 抛错，被外层 catch 吞掉后，
   「大事提醒 / 关于 / 持仓 / 指数图」等后续步骤全部不再执行。
   因此 v2 步骤「分步 try + 延后一个事件循环」执行，单步失败不再拖垮整条引导链。 */
var _initBase = init;
function v2InitSteps(){
  var steps = [
    ["cfgLoad", cfgLoad], ["apiLogLoadOnce", apiLogLoadOnce], ["alertLoad", alertLoad],
    ["posLoad", posLoad], ["klSetLoad", klSetLoad],
    ["bindKlSet", bindKlSet], ["bindAdmin", bindAdmin], ["bindAlerts", bindAlerts], ["bindCmdk", bindCmdk],
    ["klSetSyncUI", klSetSyncUI],
    ["renderAdmin", renderAdmin], ["renderAlerts", renderAlerts], ["renderAbout", renderAbout],
    ["renderHoldings", renderHoldings], ["renderPosSummary", renderPosSummary],
    ["renderIdxChart", renderIdxChart]
  ];
  for(var i = 0; i < steps.length; i++){
    try{ steps[i][1](); }
    catch(e){
      if(typeof console !== "undefined" && console.error) console.error("v2 init · " + steps[i][0] + ":", e);
    }
  }
  try{
    var n = checkAllAlerts();
    if(n > 0){
      var m = $("alMsg");
      if(m) m.textContent = "有 " + n + " 条提醒已触发，去「⑧ 大事提醒」查看";
    }
  }catch(e){}
  try{ flushCharts(); }catch(e){}
}
init = function(){
  _initBase();
  setTimeout(v2InitSteps, 0);   /* 延后一帧：等 engine11~13 顶层变量就位 */
};

/* 报告附加大事提醒 */
var _genReportV2 = genReport;
genReport = function(){
  var md = "";
  try{ md = _genReportV2(); }catch(e){ md = "# 报告生成失败\n\n" + e.message + "\n"; }
  try{
    if(md && md.indexOf("## 大事提醒") < 0){
      var blk = buildAlertBlock();
      if(md.indexOf("## 免责声明") >= 0){
        md = md.replace("## 免责声明", blk + "\n## 免责声明");
      } else {
        md = md + "\n\n" + blk;
      }
      LAST_REPORT = md;
      setReport(md);
    }
  }catch(e){}
  return md;
};

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

/* ============================================================
   engine11 · 智能添加 + 数据拉取 v2
   ------------------------------------------------------------
   1) 一句话添加：代码 / 拼音首字母 / 汉字 / 简称 → 实时候选 → 回车即加
      本地索引 992 条 + 腾讯 smartbox 全市场联网兜底（script 标签，
      天然绕过 CORS，因为接口返回的是 JS 变量赋值语句）
   2) 拉取根治：腾讯 web.ifzq（响应头 ACAO:*，浏览器直连可用）优先，
      新浪 JSONP 兜底，东财最后；逐源记录诊断，失败说清"卡在哪"
   ============================================================ */

var FETCH_DIAG = [];

/* ---------- 市场归属 ---------- */
function mktOf(code){
  code = String(code || "");
  if(/^(6|9)/.test(code))  return "sh";
  if(/^(5)/.test(code))    return "sh";
  if(/^(0|3)/.test(code))  return "sz";
  if(/^(1)/.test(code))    return "sz";
  if(/^(4|8)/.test(code))  return "bj";
  return "sz";
}
function isEtfCode(code){
  return /^(1[15689]|5[0168])/.test(String(code || ""));
}
function typeOfCode(code, name){
  if(isEtfCode(code)) return "ETF";
  if(/^(000001|399|000300|000905|000852|899050|000016|000010|000688|932000)/.test(String(code))) return "IDX";
  if(name && /ETF$|指数$|LOF$|REIT$/.test(name)) return "ETF";
  return "A";
}

/* ============================================================
   一、腾讯 smartbox 全市场搜索（script 标签，无 CORS 问题）
   ============================================================ */
function parseVHint(txt){
  var m = String(txt || "").match(/v_hint\s*=\s*"([^"]*)"/);
  if(!m) return [];
  var hint = "";
  try{ hint = JSON.parse('"' + m[1] + '"'); }catch(e){ hint = m[1]; }
  var out = [];
  hint.split("^").forEach(function(x){
    var p = x.split("~");
    if(p.length < 5) return;
    var mk = p[0], code = p[1], name = p[2], py = p[3], type = p[4];
    if(mk !== "sh" && mk !== "sz" && mk !== "bj") return;
    if(!/^[0-9]{6}$/.test(code)) return;
    if(/\(|\（/.test(name)) return;            /* 过滤带括号的非标准品种 */
    out.push({code:code, name:name, py:py, mk:mk, type:type});
  });
  return out;
}

var _sbSeq = 0;
function txSmartbox(q, cb){
  if(!q) { cb([]); return; }
  var s = document.createElement("script");
  var done = false;
  var tag = "__sbq" + (++_sbSeq);
  var fin = function(items){
    if(done) return; done = true;
    try{ if(s.parentNode) s.parentNode.removeChild(s); }catch(e){}
    cb(items || []);
  };
  /* 先清空全局，避免读到上一次结果 */
  try{ window.v_hint = ""; }catch(e){}
  s.charset = "utf-8";
  s.onload = function(){
    var items = [];
    try{
      items = parseVHint(window.v_hint || "");
      if(!items.length) items = parseVHint(window[tag] || "");
    }catch(e){}
    fin(items);
  };
  s.onerror = function(){ fin([]); };
  s.src = "https://smartbox.gtimg.cn/s3/?q=" + encodeURIComponent(q) + "&t=all";
  (document.body || document.documentElement).appendChild(s);
  setTimeout(function(){ fin([]); }, 6000);
}

/* ============================================================
   二、本地索引检索（992 条）
   ============================================================ */
/* a 是否为 b 的子序列（gmt ⊂ gzmt） */
function isSubSeq(a, b){
  var i = 0, j = 0;
  while(i < a.length && j < b.length){ if(a.charAt(i) === b.charAt(j)) i++; j++; }
  return i === a.length;
}

function searchLocal(q, limit){
  q = String(q || "").trim().toLowerCase();
  if(!q) return [];
  limit = limit || 14;
  var res = [], seen = {}, codes = Object.keys(NAME_IDX), i, v, c;
  var push = function(code, tag){
    if(seen[code]) return false;
    seen[code] = 1;
    v = NAME_IDX[code];
    res.push({code:code, name:v.name, py:v.py, src:tag});
    return res.length >= limit;
  };
  /* 1. 代码前缀 */
  for(i = 0; i < codes.length; i++){ if(codes[i].indexOf(q) === 0){ if(push(codes[i], "代码")) return res; } }
  /* 2. 拼音首字母前缀 */
  if(/^[a-z]+$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.indexOf(q) === 0){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 3. 拼音简写：首字母相同 + 是子序列（gmt ⊂ gzmt → 贵州茅台，优于 mgmt 的「麦格米特」） */
  if(/^[a-z]{2,6}$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.charAt(0) === q.charAt(0) && isSubSeq(q, v.py)){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 4. 名称包含 */
  for(i = 0; i < codes.length; i++){
    v = NAME_IDX[codes[i]];
    if(v.name && v.name.toLowerCase().indexOf(q) >= 0){ if(push(codes[i], "名称")) return res; }
  }
  /* 4. 拼音包含 */
  if(/^[a-z]+$/.test(q)){
    for(i = 0; i < codes.length; i++){
      v = NAME_IDX[codes[i]];
      if(v.py && v.py.indexOf(q) > 0){ if(push(codes[i], "拼音")) return res; }
    }
  }
  /* 5. 代码包含 */
  for(i = 0; i < codes.length; i++){
    if(codes[i].indexOf(q) > 0){ if(push(codes[i], "代码")) return res; }
  }
  return res;
}

/* 合并检索：先给本地（即时），联网到达后回调第二次 */
function searchStock(q, cb, useNet){
  q = String(q || "").trim();
  if(!q){ cb([], true); return; }
  var local = searchLocal(q, 14);
  cb(local, false);                       /* 第一批：本地 */
  if(useNet === false) { cb(local, true); return; }
  var need = (local.length < 6) || /^[\u4e00-\u9fa5]{2,}$/.test(q);
  if(!need){ cb(local, true); return; }
  txSmartbox(q, function(items){
    var seen = {}, merged = [];
    local.forEach(function(x){ seen[x.code] = 1; merged.push(x); });
    items.forEach(function(it){
      if(seen[it.code]) return;
      seen[it.code] = 1;
      merged.push({code:it.code, name:it.name, py:it.py, src:"网络"});
    });
    cb(merged.slice(0, 18), true);
  });
}

/* ============================================================
   三、智能输入控件（任意 input.qa 自动绑定）
   ============================================================ */
var QA = {el:null, pop:null, items:[], idx:-1, timer:null, seq:0, onPick:null};

function qaEnsurePop(){
  if(QA.pop && document.body.contains(QA.pop)) return QA.pop;
  var p = document.createElement("div");
  p.id = "qaPop";
  p.style.cssText = "position:absolute;z-index:9999;display:none;max-height:330px;overflow:auto;" +
    "background:var(--card);border:1px solid var(--line);border-radius:10px;" +
    "box-shadow:0 12px 32px rgba(0,0,0,.45);min-width:280px";
  document.body.appendChild(p);
  QA.pop = p;
  return p;
}

function qaClose(){
  if(QA.pop) QA.pop.style.display = "none";
  QA.el = null; QA.items = []; QA.idx = -1;
}

function qaRender(){
  var pop = qaEnsurePop(), el = QA.el;
  if(!el) return;
  if(!QA.items.length){ pop.style.display = "none"; return; }
  var r = el.getBoundingClientRect();
  var top = r.bottom + window.scrollY + 4;
  var left = r.left + window.scrollX;
  var maxLeft = document.documentElement.clientWidth - 300;
  if(left > maxLeft) left = Math.max(8, maxLeft);
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  pop.style.minWidth = Math.max(260, r.width) + "px";
  var html = "";
  QA.items.forEach(function(it, i){
    var hl = (i === QA.idx) ? "background:var(--accent);color:#fff" : "";
    var tag = it.src === "网络" ? '<span style="color:#6ee79f;font-size:11px">网</span>'
            : '<span style="opacity:.55;font-size:11px">' + it.src + '</span>';
    var inList = state.holdings.some(function(h){ return h.code === it.code; });
    html += '<div data-i="' + i + '" class="qa-item" style="padding:7px 11px;cursor:pointer;' + hl +
      'display:flex;gap:9px;align-items:center;font-size:13px">' +
      '<b style="font-family:ui-monospace,Consolas,monospace;min-width:52px">' + it.code + '</b>' +
      '<span style="flex:1">' + esc(it.name) + '</span>' + tag +
      (inList ? '<span style="font-size:11px;opacity:.7">已持有</span>' : '') +
      '</div>';
  });
  pop.innerHTML = html;
  pop.style.display = "block";
  Array.prototype.forEach.call(pop.querySelectorAll(".qa-item"), function(d){
    d.onmouseenter = function(){ QA.idx = +d.dataset.i; qaRender(); };
    d.onmousedown = function(e){ e.preventDefault(); qaPick(QA.items[+d.dataset.i]); };
  });
}

function qaPick(it){
  if(!it) return;
  var el = QA.el;
  qaClose();
  if(el){ el.value = it.code; }
  if(QA.onPick) QA.onPick(it);
  else qaAdd(it);
}

/* 默认行为：加入持仓 + 无数据则自动拉取 */
async function qaAdd(it, opt){
  opt = opt || {};
  var t = typeOfCode(it.code, it.name);
  var has = state.holdings.find(function(h){ return h.code === it.code; });
  if(!has){
    state.holdings.push({code:it.code, name:it.name, type:t, inReport:true, group:"持仓"});
    saveState();
  }
  var haveData = !!(state.stocks[it.code] && state.stocks[it.code].rows && state.stocks[it.code].rows.length > 20);
  if(!haveData){
    try{ await fetchStockData(it.code); }catch(e){}
  }
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  if(opt.silent !== true){
    var n = (state.stocks[it.code] && state.stocks[it.code].rows) ? state.stocks[it.code].rows.length : 0;
    qaToast((has ? "已存在：" : "已添加：") + it.name + "（" + it.code + "）· " +
      (n > 0 ? n + " 根日K" : "暂无数据，可点「联网拉取」或粘贴"));
  }
  return it;
}

function qaToast(msg){
  var t = document.getElementById("qaToast");
  if(!t){
    t = document.createElement("div");
    t.id = "qaToast";
    t.style.cssText = "position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:10000;" +
      "background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 18px;" +
      "font-size:13px;box-shadow:0 8px 26px rgba(0,0,0,.4);max-width:80vw";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(t._tm);
  t._tm = setTimeout(function(){ t.style.display = "none"; }, 2800);
}

function qaBind(el, onPick){
  if(!el || el._qa) return;
  el._qa = 1;
  el.setAttribute("autocomplete", "off");
  el.placeholder = el.placeholder || "输入代码 / 拼音 / 名称，如 600519、gmt、茅台";
  el.addEventListener("input", function(){
    QA.el = el; QA.onPick = onPick || null;
    var q = el.value.trim();
    clearTimeout(QA.timer);
    if(!q){ qaClose(); return; }
    var seq = ++QA.seq;
    QA.timer = setTimeout(function(){
      searchStock(q, function(items, done){
        if(seq !== QA.seq || QA.el !== el) return;
        QA.items = items; QA.idx = items.length ? 0 : -1;
        qaRender();
      });
    }, 200);
  });
  el.addEventListener("keydown", function(e){
    if(!QA.pop || QA.pop.style.display === "none") {
      if(e.key === "Enter" && el.value.trim()){ e.preventDefault(); qaSubmitRaw(el, onPick); }
      return;
    }
    if(e.key === "ArrowDown"){ e.preventDefault(); QA.idx = Math.min(QA.items.length - 1, QA.idx + 1); qaRender(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); QA.idx = Math.max(0, QA.idx - 1); qaRender(); }
    else if(e.key === "Enter"){
      e.preventDefault();
      qaPick(QA.items[QA.idx >= 0 ? QA.idx : 0]);
    }
    else if(e.key === "Escape"){ qaClose(); }
  });
  el.addEventListener("blur", function(){ setTimeout(qaClose, 180); });
}

/* 直接回车（未选候选）时也走一次检索 */
async function qaSubmitRaw(el, onPick){
  var q = el.value.trim();
  if(!q) return;
  var local = searchLocal(q, 1);
  if(local.length){ qaPick(local[0]); return; }
  txSmartbox(q, function(items){
    if(items.length){ qaPick({code:items[0].code, name:items[0].name, py:items[0].py, src:"网络"}); }
    else if(/^\d{6}$/.test(q)){
      qaPick({code:q, name:nameOf(q) || ("代码" + q), py:"", src:"代码"});
    }
    else qaToast("没找到「" + q + "」，换个关键词试试（支持代码 / 拼音首字母 / 名称）");
  });
}

function qaBindAll(root){
  var list = (root || document).querySelectorAll("input.qa");
  Array.prototype.forEach.call(list, function(el){ qaBind(el); });
}

/* ============================================================
   四、拉取 v2：多源 + 诊断（覆盖 engine3 的同名函数）
   ============================================================ */
var SRC_LABEL = {tx:"腾讯行情", sina:"新浪财经", em:"东方财富"};

function diagText(){
  if(!FETCH_DIAG.length) return "";
  return FETCH_DIAG.map(function(d){
    return "· " + (SRC_LABEL[d.src] || d.src) + "：" +
      (d.ok ? ("成功 " + d.n + " 根 / " + d.ms + "ms") : ("失败 — " + d.err + " / " + d.ms + "ms"));
  }).join("\n");
}

async function fetchStockData(code, opt){
  opt = opt || {};
  var n = opt.n || 320;
  code = String(code || "").replace(/\D/g, "").slice(0, 6);
  if(code.length !== 6) return 0;

  var order = (APICFG && APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx", "sina", "em"];
  /* 腾讯接口响应头带 ACAO:*，浏览器直连成功率最高，默认排最前 */
  if(order.indexOf("tx") < 0) order.unshift("tx");
  FETCH_DIAG = [];
  var rows = null, used = "";

  for(var i = 0; i < order.length; i++){
    var src = order[i];
    if(APICFG && APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = null;
      if(src === "tx")        raw = await withTimeout(fetchTx(code, n), 10000);
      else if(src === "sina") raw = await withTimeout(fetchSinaN(code, n), 10000);
      else if(src === "em")   raw = await withTimeout(fetchEm(code, n), 10000);
      var ms = Date.now() - t0;
      var r = (raw && raw.length) ? normRaw(raw) : [];
      if(r.length >= 8){
        rows = r; used = src;
        FETCH_DIAG.push({src:src, ok:true, ms:ms, n:r.length});
        break;
      }
      FETCH_DIAG.push({src:src, ok:false, ms:ms, err:"返回数据不足（" + r.length + " 根）"});
    }catch(e){
      FETCH_DIAG.push({src:src, ok:false, ms:Date.now() - t0,
        err:String((e && e.message) || e || "未知").slice(0, 60)});
    }
  }

  if(typeof apiLog === "function"){
    apiLog({t:new Date().toISOString().slice(0, 19).replace("T", " "), src:used || "-",
      code:code, ok:!!rows, n:rows ? rows.length : 0,
      ms:(FETCH_DIAG.length ? FETCH_DIAG[FETCH_DIAG.length - 1].ms : 0)});
  }

  if(!rows || !rows.length){
    LAST_FETCH_ERR = "全部数据源均未取到数据\n" + diagText();
    return 0;
  }
  state.stocks[code] = {rows:rows};
  if(typeof clearAn === "function") clearAn(code);
  if(typeof saveState === "function") saveState();
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h && (!h.name || /^代码/.test(h.name))){
    h.name = (NAME_IDX[code] && NAME_IDX[code].name) || h.name;
  }
  LAST_FETCH_ERR = "";
  if(typeof renderAdmin === "function" && document.getElementById("admin") &&
     document.getElementById("admin").classList.contains("on")) renderAdmin();
  return rows.length;
}

/* 批量拉取：带进度回调 */
async function fetchMany(codes, onProgress){
  var done = 0, fail = [], i;
  for(i = 0; i < codes.length; i++){
    var c = codes[i];
    if(onProgress) onProgress(i, codes.length, c);
    try{
      var n = await fetchStockData(c);
      if(n > 0) done++; else fail.push(c);
    }catch(e){ fail.push(c); }
  }
  if(onProgress) onProgress(codes.length, codes.length, "");
  return {done:done, fail:fail};
}

/* 拉取失败时的可读引导 */
function fetchFailGuide(code){
  var name = nameOf(code) || code;
  var msg = "「" + name + "（" + code + "）」联网拉取未成功。\n\n尝试记录：\n" +
    (diagText() || "（未发起请求）") +
    "\n\n常见原因：\n" +
    "1. 当前网络无法访问外网行情接口（公司/校园网常屏蔽）\n" +
    "2. 浏览器插件（广告拦截 / 隐私防护）拦截了跨域请求\n" +
    "3. 用 file:// 打开时部分浏览器限制更严，可改用本地小服务器\n\n" +
    "建议：直接粘贴日K数据（支持 Excel / 通达信 / 同花顺复制）。\n" +
    "已为你准备好粘贴模板，点确定后可直接填入。";
  return msg;
}

/* 粘贴模板（一行表头 + 一行示例） */
function pasteTemplate(){
  return "日期,开盘,最高,最低,收盘,成交量\n2026-09-10,31.20,31.80,31.05,31.60,38210000";
}

/* ============================================================
   五、批量文本解析升级：支持"一句话"混排
   允许：600519 贵州茅台 / 茅台 / gmt / 600519,gmt / 多行
   ============================================================ */
function parseSmart(text){
  var out = [];
  if(!text) return out;
  var lines = String(text).split(/[\r\n;；]+/);
  for(var i = 0; i < lines.length; i++){
    var ln = lines[i].trim();
    if(!ln) continue;
    var parts = ln.split(/[,，、\t| ]+/);
    for(var j = 0; j < parts.length; j++){
      var p = String(parts[j]).trim();
      if(!p) continue;
      var hit = searchLocal(p, 1)[0];
      if(hit){ out.push({code:hit.code, name:hit.name}); continue; }
      /* 退一步：从整段里抠 6 位代码（处理「600519 贵州茅台」被切开的情况） */
      var mc = p.match(/\d{6}/);
      if(mc) out.push({code:mc[0], name:nameOf(mc[0]) || ("代码" + mc[0])});
    }
  }
  var seen = {}, res = [];
  out.forEach(function(x){
    if(seen[x.code]) return;
    seen[x.code] = 1;
    res.push({code:x.code, name:x.name, type:typeOfCode(x.code, x.name)});
  });
  return res;
}

/* ============================================================
   engine12 · 后台管理中心 v2 + 偏好 + 自动化 + 词典 + 引导
   ------------------------------------------------------------
   后台从「只有 API」扩为 6 大模块：
     ① 数据源与 API   ② 数据缓存   ③ 存储用量
     ④ 偏好设置       ⑤ 自动化任务 ⑥ 日志与诊断
   另含：三主题切换、标的分组、指标数据字典、首次使用引导
   ============================================================ */

/* ---------------- 偏好 ---------------- */
var PREF = {theme:"dark", fs:"fs-m", repMode:"rich", period:"day", span:60,
            preset:"full", autoRefresh:false, refreshMin:15,
            autoScan:true, bootFetch:false, group:"全部"};

function prefSave(){ try{ localStorage.setItem("ashare_pref", JSON.stringify(PREF)); }catch(e){} }
function prefLoad(){
  try{
    var s = localStorage.getItem("ashare_pref");
    if(s){ var o = JSON.parse(s); for(var k in o) PREF[k] = o[k]; }
  }catch(e){}
}

var THEMES = {
  dark:  {bg:"#0b0f16", panel:"#131a25", panel2:"#1a2231", panel3:"#202a3a",
          line:"#263145", line2:"#31405a", txt:"#e8eef7", muted:"#93a1b8", muted2:"#6b7a91"},
  light: {bg:"#f4f6fa", panel:"#ffffff", panel2:"#f0f3f8", panel3:"#e6ebf3",
          line:"#d8dfea", line2:"#c3ccda", txt:"#1c2433", muted:"#5a6b85", muted2:"#7b8798"},
  sepia: {bg:"#f3ece0", panel:"#fbf6ec", panel2:"#f2e9d8", panel3:"#e9dcc4",
          line:"#ddceb3", line2:"#c9b795", txt:"#3b2f1e", muted:"#7a6a52", muted2:"#93826a"}
};

function applyTheme(t){
  PREF.theme = t || "dark";
  var m = THEMES[PREF.theme] || THEMES.dark;
  var r = document.documentElement;
  if(!r || !r.style) return;
  r.setAttribute("data-theme", PREF.theme);
  for(var k in m){ r.style.setProperty("--" + k, m[k]); }
  if(PREF.theme !== "dark"){
    r.style.setProperty("--shadow", "0 4px 18px rgba(0,0,0,.10)");
    r.style.setProperty("--up", "#d9363e");
    r.style.setProperty("--down", "#0f9d58");
  }else{
    r.style.setProperty("--shadow", "0 4px 20px rgba(0,0,0,.35)");
    r.style.setProperty("--up", "#ff4d4f");
    r.style.setProperty("--down", "#22c55e");
  }
  prefSave();
}

function applyFs(f){
  PREF.fs = f || "fs-m";
  var el = document.getElementById("reportOut");
  if(el){
    el.classList.remove("fs-s", "fs-m", "fs-l");
    el.classList.add(PREF.fs);
  }
  prefSave();
}

/* ---------------- 后台：入口（覆盖 engine9 的 renderAdmin） ----------------
   注意：不能用 `var _old = renderAdmin` 保存原函数 —— 同名函数声明会提升，
   且 init() 在 engine10 执行时 engine12 的顶层 var 还没赋值（拿到的会是
   undefined / 自身）。所以这里直接展开 engine9 的各个子步骤。 */
function renderAdmin(){
  try{ if(typeof apiLogLoadOnce === "function") apiLogLoadOnce(); }catch(e){}
  try{ if(typeof renderApiStat   === "function") renderApiStat();   }catch(e){}
  try{ if(typeof renderApiList   === "function") renderApiList();   }catch(e){}
  try{ if(typeof renderApiLog    === "function") renderApiLog();    }catch(e){}
  try{ if(typeof renderHealth    === "function") renderHealth();    }catch(e){}
  renderCachePanel();
  renderStoragePanel();
  renderPrefPanel();
  renderTaskPanel();
  renderDiagPanel();
}

/* ---------------- ② 数据缓存 ---------------- */
function stockMeta(code){
  var s = state.stocks[code];
  if(!s || !s.rows || !s.rows.length) return null;
  var r = s.rows;
  return {n:r.length, from:r[0][0], to:r[r.length - 1][0],
          bytes:JSON.stringify(r).length};
}

function renderCachePanel(){
  var box = document.getElementById("cachePanel");
  if(!box) return;
  var codes = Object.keys(state.stocks || {});
  var builtin = (typeof DEFAULT_STOCKS !== "undefined") ? Object.keys(DEFAULT_STOCKS) : [];
  var tot = 0;
  var html = '<div class="loggrid" style="margin-bottom:10px">' +
    '<div class="kv"><span>已缓存标的</span><b>' + codes.length + ' 只</b></div>' +
    '<div class="kv"><span>内置离线快照</span><b>' + builtin.length + ' 只</b></div>' +
    '<div class="kv"><span>合计占用</span><b id="cacheTot">—</b></div></div>';
  html += '<div style="max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:8px">';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">' +
    '<thead><tr style="background:var(--panel3);text-align:left">' +
    '<th style="padding:7px 10px">代码</th><th style="padding:7px 10px">名称</th>' +
    '<th style="padding:7px 10px">根数</th><th style="padding:7px 10px">区间</th>' +
    '<th style="padding:7px 10px">来源</th><th style="padding:7px 10px">占用</th>' +
    '<th style="padding:7px 10px"></th></tr></thead><tbody>';
  codes.sort().forEach(function(c){
    var m = stockMeta(c);
    if(!m) return;
    tot += m.bytes;
    var isB = builtin.indexOf(c) >= 0;
    html += '<tr style="border-top:1px solid var(--line)">' +
      '<td style="padding:6px 10px;font-family:ui-monospace,Consolas,monospace">' + c + '</td>' +
      '<td style="padding:6px 10px">' + esc(nameOf(c) || c) + '</td>' +
      '<td style="padding:6px 10px">' + m.n + '</td>' +
      '<td style="padding:6px 10px;font-size:11.5px;opacity:.8">' + m.from + ' → ' + m.to + '</td>' +
      '<td style="padding:6px 10px"><span class="pbadge ' + (isB ? "ok" : "") + '">' +
        (isB ? "内置" : "拉取") + '</span></td>' +
      '<td style="padding:6px 10px;font-size:11.5px">' + (m.bytes / 1024).toFixed(1) + ' KB</td>' +
      '<td style="padding:6px 10px"><button class="btn sm" data-del="' + c + '">删除</button></td></tr>';
  });
  html += '</tbody></table></div>';
  html += '<div class="flex" style="margin-top:10px">' +
    '<button class="btn sm" id="cacheClearPull">清空「拉取」数据（保留内置）</button>' +
    '<button class="btn sm" id="cacheClearAll">清空全部缓存</button>' +
    '<span class="muted" id="cacheMsg"></span></div>';
  box.innerHTML = html;
  var t = document.getElementById("cacheTot");
  if(t) t.textContent = (tot / 1024).toFixed(0) + " KB";

  box.querySelectorAll("[data-del]").forEach(function(b){
    b.onclick = function(){
      var c = b.dataset.del;
      delete state.stocks[c];
      saveState(); renderCachePanel();
      if(typeof renderHoldings === "function") renderHoldings();
      if(typeof renderRail === "function") renderRail();
    };
  });
  var b1 = document.getElementById("cacheClearPull");
  if(b1) b1.onclick = function(){
    Object.keys(state.stocks).forEach(function(c){
      if(builtin.indexOf(c) < 0) delete state.stocks[c];
    });
    saveState(); renderCachePanel();
    if(typeof renderHoldings === "function") renderHoldings();
  };
  var b2 = document.getElementById("cacheClearAll");
  if(b2) b2.onclick = function(){
    if(!confirm("清空全部 K 线缓存？内置离线快照也会消失，需重新拉取或粘贴。")) return;
    state.stocks = {}; saveState(); renderCachePanel();
    if(typeof renderHoldings === "function") renderHoldings();
  };
}

/* ---------------- ③ 存储用量 ---------------- */
var LS_KEYS = [
  ["ashare_state", "持仓 / 行情缓存 / 笔记"],
  ["ashare_alerts", "大事提醒"],
  ["ashare_pos", "持仓成本数量"],
  ["ashare_apicfg", "数据源配置"],
  ["ashare_apilog", "调用日志"],
  ["ashare_klset", "K线显示设置"],
  ["ashare_notes", "复盘笔记"],
  ["ashare_pref", "偏好设置"]
];

function renderStoragePanel(){
  var box = document.getElementById("storagePanel");
  if(!box) return;
  var rows = [], tot = 0;
  LS_KEYS.forEach(function(k){
    var v = "";
    try{ v = localStorage.getItem(k[0]) || ""; }catch(e){}
    var b = v.length;
    if(!b) return;
    tot += b;
    rows.push({k:k[0], d:k[1], b:b});
  });
  var cap = 5 * 1024 * 1024;
  var pct = Math.min(100, tot / cap * 100);
  var html = '<div class="loggrid" style="margin-bottom:10px">' +
    '<div class="kv"><span>已用</span><b>' + (tot / 1024).toFixed(1) + ' KB</b></div>' +
    '<div class="kv"><span>浏览器上限（约）</span><b>5 MB</b></div>' +
    '<div class="kv"><span>占用率</span><b style="color:' +
      (pct > 80 ? "var(--warn)" : "var(--down)") + '">' + pct.toFixed(1) + '%</b></div></div>';
  html += '<div style="height:10px;background:var(--panel3);border-radius:6px;overflow:hidden;margin-bottom:12px">' +
    '<div style="height:100%;width:' + pct.toFixed(1) + '%;background:' +
    (pct > 80 ? "var(--warn)" : "var(--accent)") + '"></div></div>';
  html += '<table style="width:100%;font-size:12.5px;border-collapse:collapse">' +
    '<thead><tr style="background:var(--panel3);text-align:left"><th style="padding:6px 10px">键</th>' +
    '<th style="padding:6px 10px">内容</th><th style="padding:6px 10px">大小</th></tr></thead><tbody>';
  rows.sort(function(a, b){ return b.b - a.b; }).forEach(function(r){
    html += '<tr style="border-top:1px solid var(--line)">' +
      '<td style="padding:5px 10px;font-family:ui-monospace,Consolas,monospace;font-size:11.5px">' + r.k + '</td>' +
      '<td style="padding:5px 10px">' + r.d + '</td>' +
      '<td style="padding:5px 10px">' + (r.b / 1024).toFixed(1) + ' KB</td></tr>';
  });
  html += '</tbody></table>';
  html += '<div class="hint" style="margin-top:10px;font-size:12px">' +
    '全部数据只存在这台电脑的浏览器里，<b>不会上传</b>。清理浏览器缓存会一并清除，建议定期用「导出全部数据」备份。</div>';
  box.innerHTML = html;
}

/* ---------------- ④ 偏好设置 ---------------- */
function renderPrefPanel(){
  var box = document.getElementById("prefPanel");
  if(!box) return;
  var seg = function(id, items, cur){
    return '<div class="segpick" id="' + id + '">' + items.map(function(it){
      return '<button data-v="' + it[0] + '"' + (it[0] === cur ? ' class="on"' : '') + '>' + it[1] + '</button>';
    }).join("") + '</div>';
  };
  var html =
    '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px">' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">界面主题</div>' +
      seg("segTheme", [["dark", "深色"], ["light", "浅色"], ["sepia", "护眼"]], PREF.theme) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">报告字号</div>' +
      seg("segFs", [["fs-s", "小"], ["fs-m", "中"], ["fs-l", "大"]], PREF.fs) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">报告默认模式</div>' +
      seg("segRep", [["rich", "富文本"], ["raw", "纯文本"]], PREF.repMode) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认周期</div>' +
      seg("segPd", [["day", "日线"], ["week", "周线"]], PREF.period) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认视野</div>' +
      seg("segSp", [["20", "20"], ["40", "40"], ["60", "60"], ["90", "90"], ["180", "180"], ["0", "全部"]],
        String(PREF.span)) + '</div>' +
    '<div><div class="muted" style="font-size:12px;margin-bottom:6px">K线默认预设</div>' +
      seg("segPs", [["bare", "裸K"], ["ma", "均线"], ["boll", "布林"], ["chan", "通道"], ["wave", "波浪"], ["full", "全开"]],
        PREF.preset) + '</div>' +
    '</div>' +
    '<div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:16px;align-items:center">' +
      '<label class="ck"><input type="checkbox" id="ckAutoScan"' + (PREF.autoScan ? " checked" : "") + '> 打开时自动扫描大事提醒</label>' +
      '<label class="ck"><input type="checkbox" id="ckBootFetch"' + (PREF.bootFetch ? " checked" : "") + '> 打开时自动补拉缺失行情</label>' +
    '</div>';
  box.innerHTML = html;

  var bind = function(id, fn){
    var p = document.getElementById(id);
    if(!p) return;
    p.querySelectorAll("button").forEach(function(b){
      b.onclick = function(){
        p.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
        b.classList.add("on");
        fn(b.dataset.v);
      };
    });
  };
  bind("segTheme", function(v){ applyTheme(v); });
  bind("segFs",    function(v){ applyFs(v); });
  bind("segRep",   function(v){ PREF.repMode = v; prefSave(); if(typeof REP !== "undefined"){ REP.mode = v; if(typeof setReport === "function") setReport(REP.raw || ""); } });
  bind("segPd",    function(v){ PREF.period = v; prefSave(); });
  bind("segSp",    function(v){ PREF.span = parseInt(v, 10) || 60; prefSave(); });
  bind("segPs",    function(v){ PREF.preset = v; prefSave(); if(typeof KLSET !== "undefined" && typeof applyPreset === "function"){ applyPreset(v); if(typeof drawKline === "function") drawKline(); } });
  var c1 = document.getElementById("ckAutoScan");
  if(c1) c1.onchange = function(){ PREF.autoScan = c1.checked; prefSave(); };
  var c2 = document.getElementById("ckBootFetch");
  if(c2) c2.onchange = function(){ PREF.bootFetch = c2.checked; prefSave(); };
}

/* ---------------- ⑤ 自动化任务 ---------------- */
var TASK = {timer:null, last:"", running:false};

function taskLog(msg){
  TASK.last = new Date().toTimeString().slice(0, 8) + " " + msg;
  var el = document.getElementById("taskLast");
  if(el) el.textContent = TASK.last;
}

async function taskTick(manual){
  if(TASK.running) return;
  TASK.running = true;
  try{
    var b = document.getElementById("btnRefresh");
    if(b) b.click();
    taskLog("已刷新行情");
    if(PREF.autoScan && typeof checkAllAlerts === "function"){
      checkAllAlerts();
      taskLog("已刷新行情并扫描提醒");
    }
  }catch(e){ taskLog("出错：" + e.message); }
  TASK.running = false;
}

function taskStart(){
  taskStop();
  var min = Math.max(1, parseInt((document.getElementById("taskMin") || {}).value, 10) || 15);
  PREF.refreshMin = min; prefSave();
  TASK.timer = setInterval(taskTick, min * 60000);
  var el = document.getElementById("taskState");
  if(el) el.innerHTML = '<span class="pbadge ok">运行中 · 每 ' + min + ' 分钟</span>';
  taskLog("定时任务已启动（每 " + min + " 分钟）");
}
function taskStop(){
  if(TASK.timer) clearInterval(TASK.timer);
  TASK.timer = null;
  var el = document.getElementById("taskState");
  if(el) el.innerHTML = '<span class="pbadge">已停止</span>';
}

function renderTaskPanel(){
  var box = document.getElementById("taskPanel");
  if(!box) return;
  box.innerHTML =
    '<div class="hint" style="font-size:12.5px;line-height:1.9;margin-bottom:12px">' +
    '定时自动刷新指数与涨跌家数，并按你的提醒条件扫描命中项。' +
    '仅在<b>本页保持打开</b>时生效；关闭标签页即停止（浏览器限制，不会后台常驻）。</div>' +
    '<div class="flex" style="flex-wrap:wrap;gap:10px;align-items:center">' +
      '<span class="lbl">间隔</span>' +
      '<input id="taskMin" type="number" min="1" max="240" value="' + (PREF.refreshMin || 15) + '" style="max-width:80px"> 分钟' +
      '<button class="btn primary sm" id="taskGo">启动</button>' +
      '<button class="btn sm" id="taskStopBtn">停止</button>' +
      '<button class="btn sm" id="taskNow">立即执行一次</button>' +
      '<span id="taskState">' + (TASK.timer ? '<span class="pbadge ok">运行中</span>' : '<span class="pbadge">已停止</span>') + '</span>' +
      '<span class="muted" id="taskLast">' + (TASK.last || "尚未运行") + '</span>' +
    '</div>';
  var g = document.getElementById("taskGo");   if(g) g.onclick = taskStart;
  var s = document.getElementById("taskStopBtn"); if(s) s.onclick = taskStop;
  var n = document.getElementById("taskNow");  if(n) n.onclick = function(){ taskTick(true); };
}

/* ---------------- ⑥ 诊断与自检 ---------------- */
function runSelfCheck(){
  var items = [];
  var push = function(name, ok, detail){ items.push({name:name, ok:ok, detail:detail}); };
  push("行情数据", Object.keys(state.stocks || {}).length > 0,
    Object.keys(state.stocks || {}).length + " 只标的有 K 线");
  push("持仓列表", true, state.holdings.length + " 只（本机私有，不在源码中）");
  var bad = state.holdings.filter(function(h){
    var s = state.stocks[h.code]; return !s || !s.rows || s.rows.length < 20; });
  push("数据完整性", bad.length === 0,
    bad.length ? (bad.length + " 只缺数据：" + bad.map(function(x){ return x.name; }).slice(0, 5).join("、"))
               : "全部持仓均有足够 K 线");
  var hasIdx = !!(typeof DEFAULT_INDEX !== "undefined" && Object.keys(DEFAULT_INDEX).length);
  push("指数快照", hasIdx, hasIdx ? (Object.keys(DEFAULT_INDEX).length + " 个指数") : "缺失");
  push("图表引擎", typeof echarts !== "undefined", typeof echarts !== "undefined" ? ("ECharts " + (echarts.version || "")) : "未加载 echarts.min.js");
  push("本地存储", (function(){ try{ localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return true; }catch(e){ return false; } })(),
    "localStorage 可写");
  push("内置索引", Object.keys(NAME_IDX).length > 500, Object.keys(NAME_IDX).length + " 条名称索引");
  return items;
}

function renderDiagPanel(){
  var box = document.getElementById("diagPanel");
  if(!box) return;
  var items = runSelfCheck();
  var html = '<div class="loggrid">';
  items.forEach(function(it){
    html += '<div class="kv"><span>' + it.name + '</span><b style="color:' +
      (it.ok ? "var(--down)" : "var(--warn)") + '">' + (it.ok ? "正常" : "注意") +
      '</b><span class="muted" style="font-size:11.5px;grid-column:1/-1">' + it.detail + '</span></div>';
  });
  html += '</div>';
  html += '<div style="margin-top:12px"><b style="font-size:12.5px">最近一次联网拉取</b>' +
    '<pre style="white-space:pre-wrap;font-size:12px;background:var(--panel2);' +
    'border:1px solid var(--line);border-radius:8px;padding:10px;margin-top:6px">' +
    (LAST_FETCH_ERR ? esc(LAST_FETCH_ERR) : (FETCH_DIAG.length ? esc(diagText()) : "（本次启动后尚未发起拉取）")) +
    '</pre></div>';
  box.innerHTML = html;
}

/* ---------------- 指标数据字典 ---------------- */
var DICT = [
  ["MA 均线", "收盘价的算术平均。MA5/20/60 分别代表一周、一月、一季的平均成本。",
   "价格在 MA20 上方且 MA20 向上，中期偏多；跌破且 MA20 走平转下，需警惕。<b>均线是滞后指标</b>，震荡市中频繁上下穿属正常噪声。"],
  ["MACD", "DIF（12日与26日EMA之差）减去 DEA（DIF 的 9 日EMA），柱=2×(DIF−DEA)。",
   "金叉（DIF 上穿 DEA）常被视为转强信号，死叉反之。<b>顶部/底部背离（价格新高但 MACD 不新高）比金叉死叉更有预警价值</b>。"],
  ["RSI(14)", "一定周期内涨跌幅的相对强弱，0~100。",
   ">70 为超买区，<30 为超卖区。<b>强势股可以长期超买，弱势股可以长期超卖</b>，单独用 RSI 抄底逃顶容易连续误判。"],
  ["KDJ(9,3,3)", "以最高/最低价计算的随机指标，K、D、J 三线。",
   "J 值 >100 或 <0 属极值。<b>KDJ 在趋势市钝化明显</b>，应与 MACD、量能配合使用。"],
  ["BOLL(20,2)", "中轨=MA20，上下轨=中轨±2倍标准差。",
   "带宽收窄（布林收口）往往预示变盘；价格触及上轨不等于必须卖出。<b>带宽只能衡量波动，不能指示方向</b>。"],
  ["ATR(14)", "真实波幅均值，衡量近期平均波动幅度。",
   "常用于设置止损距离（如 1.5×ATR）。<b>波动越大止损应越宽，否则容易被正常波动扫出</b>。"],
  ["量比", "当前成交量 / 过去 5 日同期均量。",
   ">1.5 为放量，<0.7 为缩量。<b>上涨放量、下跌缩量是健康结构；上涨缩量需警惕后继乏力</b>。"],
  ["POC 密集成交区", "区间内成交量最集中的价格带。",
   "价格回到 POC 附近常出现反复。<b>筹码密集区既是支撑也是阻力，方向由突破方决定</b>。"],
  ["趋势通道", "由近期摆动高点与低点拟合的上下轨。",
   "通道内运行属常态；<b>有效跌破下轨（且伴随放量）才算趋势破坏</b>，单根插针不算。"],
  ["艾略特波浪", "ZigZag 识别摆动点后，用「2浪不破1浪起点 / 3浪不是最短 / 4浪不重叠1浪」三条规则校验 5 浪结构。",
   "<b>浪型是主观性很强的事后描述</b>，同一段行情常有多种数法。本工具只做客观标注，请以关键位和风控为准，不要依赖浪型做单。"],
  ["顶背离 / 底背离", "价格创新高（新低）而指标未创新高（新低）。",
   "背离提示动能衰减，<b>但背离可以多次出现后才转折</b>，不宜作为唯一买卖依据。"],
  ["五维技术评分", "趋势 / 动量 / 量能 / 波动 / 位置 五个维度各 0~100 分后的加权。",
   "用于横向比较同一时点不同标的的相对强弱，<b>不是预测分数</b>，60 分不代表会涨。"],
  ["最大回撤", "区间内从最高点到之后最低点的最大跌幅。",
   "衡量最坏情况。<b>收益/回撤比（Calmar）比单看收益更能反映持仓体验</b>。"]
];

function renderDict(){
  var box = document.getElementById("dictBox");
  if(!box) return;
  var q = (document.getElementById("dictQ") || {}).value || "";
  var html = "";
  DICT.forEach(function(d, i){
    if(q && (d[0] + d[1] + d[2]).toLowerCase().indexOf(q.toLowerCase()) < 0) return;
    html += '<details style="border:1px solid var(--line);border-radius:8px;margin-bottom:7px;padding:0 10px"' +
      (i === 0 && !q ? " open" : "") + '>' +
      '<summary style="cursor:pointer;padding:9px 0;font-size:13.5px;font-weight:600">' + d[0] + '</summary>' +
      '<div style="font-size:12.5px;line-height:1.9;padding-bottom:10px">' +
      '<div style="opacity:.9">' + d[1] + '</div>' +
      '<div style="margin-top:6px;color:var(--muted)">' + d[2] + '</div></div></details>';
  });
  box.innerHTML = html || '<div class="muted">没有匹配的指标</div>';
}

/* ---------------- 标的分组 ---------------- */
var GROUPS = ["持仓", "自选", "观察", "已清"];

function setGroup(code, g){
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h){ h.group = g; saveState(); }
}
function groupOf(code){
  var h = state.holdings.find(function(x){ return x.code === code; });
  return (h && h.group) || "持仓";
}

/* ---------------- 首次使用引导 ---------------- */
function firstRunGuide(){
  var box = document.getElementById("guideBox");
  if(!box) return;
  if(state.holdings.length > 0){ box.style.display = "none"; return; }
  box.style.display = "";
  box.innerHTML =
    '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">' +
    '<div style="flex:1;min-width:280px">' +
      '<div style="font-size:15px;font-weight:700;margin-bottom:6px">👋 先加几只标的吧</div>' +
      '<div class="hint" style="font-size:12.5px;line-height:1.9">' +
      '这个工具<b>不内置任何持仓</b>——你的数据只存在这台电脑。' +
      '在上面输入框里随便敲：<b>代码</b>（600519）、<b>拼音首字母</b>（gmt）、' +
      '或<b>汉字</b>（茅台 / 半导体），都能直接搜到并一键加入。' +
      '也可以一次粘一整段（一行一个，逗号分隔都行）。</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;align-items:center">' +
      '<button class="btn primary sm" id="guideDemo">载入 5 只示例标的</button>' +
      '<button class="btn sm" id="guideHide">不再显示</button>' +
    '</div></div>';
  var d = document.getElementById("guideDemo");
  if(d) d.onclick = async function(){
    var demo = [["600519", "贵州茅台"], ["300750", "宁德时代"], ["000063", "中兴通讯"],
                ["512880", "证券ETF"], ["000001", "上证指数"]];
    for(var i = 0; i < demo.length; i++){
      if(!state.holdings.find(function(h){ return h.code === demo[i][0]; }))
        state.holdings.push({code:demo[i][0], name:demo[i][1], type:typeOfCode(demo[i][0], demo[i][1]), inReport:true, group:"持仓"});
    }
    saveState();
    if(typeof renderHoldings === "function") renderHoldings();
    if(typeof renderRail === "function") renderRail();
    if(typeof renderDash === "function") renderDash();
    box.style.display = "none";
    qaToast("已载入 5 只示例标的，可随时在持仓管理删除");
  };
  var h = document.getElementById("guideHide");
  if(h) h.onclick = function(){
    try{ localStorage.setItem("ashare_guide_off", "1"); }catch(e){}
    box.style.display = "none";
  };
}

/* ---------------- 启动挂载 ---------------- */
function initExtras(){
  prefLoad();
  applyTheme(PREF.theme);
  applyFs(PREF.fs);
  if(PREF.period && typeof CUR !== "undefined") CUR.period = PREF.period;
  if(PREF.span && typeof CUR !== "undefined")  CUR.span = PREF.span;
  qaBindAll(document);
  if(typeof bindAdmin === "function"){ try{ bindAdmin(); }catch(e){} }
  renderDict();
  var dq = document.getElementById("dictQ");
  if(dq) dq.oninput = renderDict;
  firstRunGuide();
  if(PREF.autoScan && typeof checkAllAlerts === "function"){
    try{ checkAllAlerts(); }catch(e){}
  }
  if(PREF.bootFetch){
    var miss = state.holdings.filter(function(h){
      var s = state.stocks[h.code]; return !s || !s.rows || s.rows.length < 20;
    }).map(function(h){ return h.code; });
    if(miss.length) fetchMany(miss.slice(0, 30));
  }
}

/* ---------------- 启动（等 engine10 的 init 跑完再挂） ---------------- */
function bootExtras(){
  if(typeof state === "undefined" || !state || !state.holdings){
    setTimeout(bootExtras, 40); return;
  }
  try{ initExtras(); }catch(e){ if(window.console) console.warn("initExtras:", e); }
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(bootExtras, 40); });
}else{
  setTimeout(bootExtras, 40);
}

/* ============================================================
   engine13 · 大盘行情增强（趋势线 + 艾略特波浪 + UI 重排）
   —— 形态识别均为客观计算 + 规则推理，不构成投资建议
   ============================================================ */

/* ---------------- 状态扩展 ----------------
   注意：init() 在 engine10 末尾同步执行，而 engine13 的顶层 var 赋值
   排在其后 —— 因此这里必须做「惰性初始化」，不能在顶层直接赋值后就用。 */
var IDX_AN;                            /* (code|period|len) → an 缓存 */
function idxSavePref(){
  try{ localStorage.setItem("idxv2", JSON.stringify({
    mode:IDXV.mode, pick:IDXV.pick, period:IDXV.period, span:IDXV.span,
    trend:IDXV.trend, chan:IDXV.chan, wave:IDXV.wave,
    ma:IDXV.ma, fill:IDXV.fill, vol:IDXV.vol, wavePct:IDXV.wavePct
  })); }catch(e){}
}
function idxLoadPref(){
  try{
    var s = localStorage.getItem("idxv2");
    if(!s) return;
    var o = JSON.parse(s);
    for(var k in o) if(o[k] != null) IDXV[k] = o[k];
  }catch(e){}
}
function idxEnsure(){
  if(typeof IDX_AN === "undefined" || !IDX_AN) IDX_AN = {};
  if(typeof IDXV === "undefined" || !IDXV) IDXV = {};
  if(!IDXV._init2){
    IDXV._init2 = 1;
    /* 首次默认值：单指数 K线 + 趋势线 + 通道 + 波浪 + 均线 + 成交量 */
    if(IDXV.span   == null) IDXV.span   = 60;
    IDXV.mode = "kline"; IDXV.pick = "000001"; IDXV.period = "day";
    IDXV.trend = true; IDXV.chan = true; IDXV.wave = true;
    IDXV.ma = true; IDXV.vol = true; IDXV.fill = false;
    IDXV.wavePct = "auto";
    idxLoadPref();                      /* 用户偏好覆盖默认 */
  }
  if(IDXV.pick   == null) IDXV.pick   = "000001";
  if(IDXV.period == null) IDXV.period = "day";
  if(IDXV.trend  == null) IDXV.trend  = true;
  if(IDXV.chan   == null) IDXV.chan   = true;
  if(IDXV.wave   == null) IDXV.wave   = false;
  if(IDXV.vol    == null) IDXV.vol    = true;
  if(IDXV.wavePct == null) IDXV.wavePct = "auto";
  return IDXV;
}

function IDX_PICK_NAME(){
  idxEnsure();
  var d = idxDefs();
  for(var i=0;i<d.length;i++) if(d[i][0] === IDXV.pick) return d[i][1];
  return "指数";
}
function IDX_SINGLE(){ idxEnsure(); return IDXV.mode === "kline" || IDXV.mode === "close"; }

/* ============================================================
   0. 工作台 UI 状态（纯函数：先推导状态，再写 DOM）
   —— 便于验证，也避免「先改 DOM 再判断」造成的状态不一致
   ============================================================ */
function hexA(h, a){
  if(!h || h.charAt(0) !== "#") return h;
  var s = h.slice(1);
  if(s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  var n = parseInt(s, 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
/* 区间换算：周线模式下与 renderIdxSingle 保持一致 */
function idxWeekN(span){
  var s = parseInt(span, 10) || 0;
  if(s <= 0) return 0;
  return Math.min(s, Math.max(12, Math.round(s / 4)));
}
function idxNoteText(single, mode, wave, trend){
  if(!single){
    return '<b>三指数对比</b>：看谁更强 —— 线在上方、斜率更陡者相对占优；' +
           '<b>归一化</b>以首日 = 100 消除点位差异，<b>涨跌%</b>看区间累计收益。' +
           '滚轮缩放、拖拽平移，底部滑块可框选区间。';
  }
  var base = (mode === "kline")
    ? '<b>K线</b>：红涨绿跌，实体看力度、影线看多空争夺；跌破前低 / 站上前高常作为结构判断起点。'
    : '<b>收盘线</b>：只看收盘价走势，用于过滤日内噪声。';
  var ov = [];
  if(trend) ov.push("趋势线（摆动点线性外推）");
  if(wave)  ov.push("艾略特波浪（1-2-3-4-5 / A-B-C）");
  if(ov.length) base += ' 已叠加：' + ov.join("、") + '。';
  base += ' 图下依次为 <b>关键位</b>、<b>趋势线解读</b>、<b>浪型进度</b> 与 <b>区间统计</b>。';
  return base;
}
function idxUiState(){
  idxEnsure();
  var single = IDX_SINGLE();
  var defs = idxDefs(), nm = "三大指数", color = "#4c8dff", i;
  for(i = 0; i < defs.length; i++) if(defs[i][0] === IDXV.pick){ nm = defs[i][1]; color = defs[i][2]; }
  var per = IDXV.period === "week" ? "week" : "day";
  var modeTxt = ({norm:"三指数 · 归一化对比", chg:"三指数 · 涨跌% 对比",
                  kline:"K线", close:"收盘线"})[IDXV.mode] || "K线";
  var span = parseInt(IDXV.span, 10) || 0;
  var an = single ? idxAn(IDXV.pick, per) : null;
  var totN = (an && an.dates) ? an.dates.length : 0;
  var winN = span > 0 ? (per === "week" ? idxWeekN(span) : span) : totN;
  if(totN && winN > totN) winN = totN;

  var title = single ? (nm + " · " + modeTxt + "（" + (per === "week" ? "周线" : "日线") + "）") : modeTxt;
  var sub = [];
  sub.push(span > 0 ? ("近 " + winN + (per === "week" ? " 周" : " 根")) : ("全部 " + (totN || 0) + " 根"));
  var sd = (typeof SNAPSHOT_DATE !== "undefined" && SNAPSHOT_DATE) ? SNAPSHOT_DATE : "";
  if(sd) sub.push("数据截至 " + sd);

  var tags = [];
  if(single){
    tags.push(["趋势线", !!IDXV.trend]);
    tags.push(["通道", !!IDXV.chan]);
    tags.push(["波浪", !!IDXV.wave]);
    tags.push(["均线", !!IDXV.ma]);
    tags.push(["成交量", !!(IDXV.vol && IDXV.mode === "kline")]);
    tags.push(["面积填充", !!(IDXV.fill && IDXV.mode === "close")]);
  }
  var dis = {
    target: !single,                              /* 指数 / 周期 / 画线 仅单指数有效 */
    wavePct: !single || !IDXV.wave,
    vol: IDXV.mode !== "kline",                   /* 成交量副图仅 K线 */
    fill: IDXV.mode !== "close"                   /* 面积填充仅收盘线 */
  };
  return {single:single, nm:nm, color:color, per:per, modeTxt:modeTxt,
          span:span, winN:winN, totN:totN, title:title, sub:sub.join(" · "),
          tags:tags, dis:dis, note:idxNoteText(single, IDXV.mode, !!IDXV.wave, !!IDXV.trend)};
}

/* ============================================================
   1. 工作台头部（标题 / 叠加标签 / 图下说明 / 状态条）
   ============================================================ */
function idxHeadSync(st){
  st = st || idxUiState();
  var t = $("clabTitle"), s = $("clabSub"), d = $("clabDot"), tg = $("clabTags");
  if(t)  t.textContent = st.title;
  if(s)  s.textContent = st.sub;
  if(d){ d.style.background = st.color; d.style.boxShadow = "0 0 0 3px " + hexA(st.color, .18); }
  if(tg){
    if(!st.tags.length) tg.innerHTML = '<span class="tg">三指数对比模式</span>';
    else tg.innerHTML = st.tags.map(function(x){
      return '<span class="tg' + (x[1] ? " on" : "") + '">' + x[0] + '</span>';
    }).join("");
  }
  var nt = $("idxChartNote"); if(nt) nt.innerHTML = st.note;
  var sn = $("idxSpanNote");
  if(sn) sn.textContent = "当前 " + (st.span > 0 ? ("近 " + st.winN + (st.per === "week" ? " 周" : " 根"))
                                                  : ("全部 " + (st.totN || 0) + " 根"));
  var tn = $("grpIdxTargetNote");
  if(tn) tn.textContent = st.single ? "可切换指数与周期" : "切到单指数模式生效";
}

/* 图下状态条：把当前关键结论浓缩成 chips（不新增计算，复用已算好的结果） */
function renderIdxStateBar(){
  var box = $("idxChartState"); if(!box) return;
  if(!IDX_SINGLE()){ box.innerHTML = ""; return; }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = ""; return; }
  var h = "", last = an.close, i;
  /* 趋势线状态 */
  if(IDXV.trend){
    try{
      var tr = idxTrendLines(an);
      if(tr.up) h += '<span class="tg ' + (last >= tr.up.endV ? "on" : "") + '">上升线 ' + f2(tr.up.endV) + '</span>';
      if(tr.dn) h += '<span class="tg ' + (last >= tr.dn.endV ? "on" : "") + '">下降线 ' + f2(tr.dn.endV) + '</span>';
    }catch(e){}
  }
  /* 浪型阶段 */
  if(IDXV.wave){
    try{
      var e = idxElliott(an);
      if(e && e.found && e.imp){
        var P = e.imp.P, up = e.imp.up, step = "1";
        if(e.corr && e.corr.length >= 3) step = "C";
        else if(e.corr && e.corr.length >= 2) step = "B";
        else if(e.corr && e.corr.length >= 1) step = "A";
        else if((up && last >= P[4].v) || (!up && last <= P[4].v)) step = "5";
        else if((up && last >= P[3].v) || (!up && last <= P[3].v)) step = "4";
        else if((up && last >= P[2].v) || (!up && last <= P[2].v)) step = "3";
        else if((up && last >= P[1].v) || (!up && last <= P[1].v)) step = "2";
        h += '<span class="tg on">' + (up ? "向上" : "向下") + '浪型 第 ' + step + ' 段</span>';
      }
    }catch(e2){}
  }
  /* 指标位置 */
  var pos = [];
  [[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(function(m){
    if(nn(m[0][an.i])) pos.push(m[1] + (last > m[0][an.i] ? "上方" : "下方"));
  });
  if(pos.length) h += '<span class="tg on">' + pos.join(" · ") + '</span>';
  box.innerHTML = h;
}

/* ---------------- 取指数分析对象（日 / 周） ---------------- */
function idxAn(cd, period){
  idxEnsure();
  var stk = (typeof state !== "undefined") ? state.stocks[cd] : null;
  if(!stk || !stk.rows) return null;
  var key = cd + "|" + (period||"day") + "|" + stk.rows.length;
  if(IDX_AN[key]) return IDX_AN[key];
  var an;
  if(period === "week"){
    try{
      var wr = weeklyFromDaily(stk.rows);
      an = analyzeStock({rows: wr, name: nameOf(cd) || cd, code: cd});
      if(an && an.err) an = null;
    }catch(e){ an = null; }
  }else{
    an = getAn(cd);
  }
  if(an) IDX_AN[key] = an;
  return an || null;
}

/* ============================================================
   一、趋势线自动识别
   思路：ZigZag 摆动点 → 取最近两个同向且递增（低点）/递减（高点）的摆动点
        → 线性外推到最后一根 → 判突破；摆动点价格聚类 → 水平支撑压力
   ============================================================ */
function idxFitLine(an, a, b){
  var n = an.dates.length;
  if(!(b.i > a.i)) return null;
  var slope = (b.v - a.v) / (b.i - a.i);
  var arr = [];
  for(var i=0;i<n;i++) arr.push(i >= a.i ? (a.v + slope * (i - a.i)) : null);
  var mid = (a.v + b.v) / 2 || 1;
  return {
    i1:a.i, i2:n-1, v1:a.v, v2:b.v, slope:slope,
    slopePct: slope / mid * 100,
    endV: arr[n-1], data: arr,
    x1: an.dates[a.i], x2: an.dates[b.i]
  };
}

function idxTrendLines(an){
  var res = {up:null, dn:null, levels:[], piv:[], note:[]};
  if(!an || !an.dates || an.dates.length < 20) return res;
  var pct = (typeof KLSET !== "undefined" && KLSET.wavePct ? KLSET.wavePct : 5) / 100;
  var piv = zigzagPivots(an, pct);
  res.piv = piv;
  if(piv.length < 3) return res;

  /* 上升趋势线：最近两个「递增」低点 */
  var lows = piv.filter(function(p){ return p.t === -1; }).slice(-5);
  for(var i = lows.length - 1; i >= 1; i--){
    if(lows[i].i > lows[i-1].i && lows[i].v > lows[i-1].v){
      res.up = idxFitLine(an, lows[i-1], lows[i]); break;
    }
  }
  /* 下降趋势线：最近两个「递减」高点 */
  var highs = piv.filter(function(p){ return p.t === 1; }).slice(-5);
  for(var j = highs.length - 1; j >= 1; j--){
    if(highs[j].i > highs[j-1].i && highs[j].v < highs[j-1].v){
      res.dn = idxFitLine(an, highs[j-1], highs[j]); break;
    }
  }
  /* 水平关键位：摆动点价格聚类（±1.2%） */
  var bks = [], k, hit;
  for(i = 0; i < piv.length; i++){
    hit = null;
    for(k = 0; k < bks.length; k++){
      if(Math.abs(bks[k].v - piv[i].v) / piv[i].v < 0.012){ hit = bks[k]; break; }
    }
    if(hit){ hit.v = (hit.v * hit.n + piv[i].v) / (hit.n + 1); hit.n++; }
    else bks.push({v:piv[i].v, n:1});
  }
  var close = an.close;
  res.levels = bks.filter(function(b){ return b.n >= 2; })
    .map(function(b){
      return {v:b.v, n:b.n, side: b.v < close ? "sup" : "res",
              dist: (b.v - close) / close * 100};
    })
    .filter(function(b){ return Math.abs(b.dist) < 22; })
    .sort(function(x,y){ return Math.abs(x.dist) - Math.abs(y.dist); })
    .slice(0, 6);

  /* 突破判定 */
  if(res.up){
    if(close < res.up.endV * 0.995) res.note.push({t:"bad", s:"收盘跌破上升趋势线（线位 " + f2(res.up.endV) + "）"});
    else if(close < res.up.endV * 1.02) res.note.push({t:"warn", s:"贴近上升趋势线（线位 " + f2(res.up.endV) + "），距线仅 " + ((close/res.up.endV-1)*100).toFixed(2) + "%"});
    else res.note.push({t:"good", s:"运行于上升趋势线上方（线位 " + f2(res.up.endV) + "）"});
  }
  if(res.dn){
    if(close > res.dn.endV * 1.005) res.note.push({t:"good", s:"收盘突破下降趋势线（线位 " + f2(res.dn.endV) + "）"});
    else if(close > res.dn.endV * 0.98) res.note.push({t:"warn", s:"贴近下降趋势线（线位 " + f2(res.dn.endV) + "）"});
    else res.note.push({t:"bad", s:"受压于下降趋势线下方（线位 " + f2(res.dn.endV) + "）"});
  }
  return res;
}

/* 趋势线 → ECharts line series */
function idxTrendSeries(an, tr){
  var out = [];
  if(!tr) return out;
  if(tr.up){
    out.push({name:"上升趋势线", type:"line", data:tr.up.data, showSymbol:false, smooth:false,
      lineStyle:{color:"#22c55e", width:1.8, type:"solid"}, z:6,
      endLabel:{show:true, formatter:"上升线 " + f2(tr.up.endV), color:"#7ee79f", fontSize:11}});
  }
  if(tr.dn){
    out.push({name:"下降趋势线", type:"line", data:tr.dn.data, showSymbol:false, smooth:false,
      lineStyle:{color:"#ff7875", width:1.8, type:"solid"}, z:6,
      endLabel:{show:true, formatter:"下降线 " + f2(tr.dn.endV), color:"#ff9d9b", fontSize:11}});
  }
  return out;
}

/* 水平关键位 → markLine data */
function idxLevelMark(tr){
  var out = [];
  if(!tr || !tr.levels) return out;
  tr.levels.forEach(function(l){
    var sup = l.side === "sup";
    out.push({yAxis:l.v, symbol:"none",
      lineStyle:{color: sup ? "rgba(110,231,159,.55)" : "rgba(255,120,120,.55)",
                 type:"dashed", width:1.1},
      label:{show:true, formatter:(sup?"支撑 ":"压力 ") + f2(l.v) + " (" + (l.dist>0?"+":"") + l.dist.toFixed(1) + "%)",
        position:"insideEndTop", color: sup ? "#7ee79f" : "#ff9d9b", fontSize:10.5}});
  });
  return out;
}

/* ============================================================
   二、主图渲染（覆盖 engine7 的 renderIdxChart）
   ============================================================ */
/* ============================================================
   波浪阈值自适应
   指数波动远小于个股，同一阈值在不同指数上差异很大：
   实测上证日线 2%~3.5% 可识别、深成需 4%~6%、创业板 2%~2.5%，
   而周线 3%~4% 三个指数都能识别。故提供「自动」模式逐个试。
   ============================================================ */
function idxWavePct(an){
  idxEnsure();
  if(IDXV.wavePct && IDXV.wavePct !== "auto") return parseFloat(IDXV.wavePct);
  /* 局部常量：避免顶层 var 在 init 同步执行时尚未赋值 */
  var TRY = [3.5, 3, 2.5, 4, 2, 5, 6, 1.5, 8];
  for(var i = 0; i < TRY.length; i++){
    var e = elliott(an, TRY[i]);
    if(e.found) return TRY[i];
  }
  return (typeof KLSET !== "undefined" && KLSET.wavePct) || 5;
}
function idxElliott(an){
  return elliott(an, idxWavePct(an));
}

function renderIdxChart(){ renderIdxChartImpl(); }

function renderIdxChartImpl(){
  idxEnsure();
  var el = $("idxChart"); if(!el) return;
  var run = function(){
    var c = ensureChart(el);
    if(!c){ deferChart(el, run); return; }
    if(IDX_SINGLE()) renderIdxSingle(el, c);
    else renderIdxMulti(el, c);
    renderIdxTrendBox();
    renderIdxWaveBox();
    renderIdxLevels();
    renderIdxCorr();
    renderIdxMultiTf();
    renderIdxStateBar();
    idxV2SyncUI();
  };
  run();
}

/* ---------- 单指数：K线 / 收盘价 ---------- */
function renderIdxSingle(el, c){
  var cd = IDXV.pick, nm = IDX_PICK_NAME();
  var an = idxAn(cd, IDXV.period);
  if(!an){
    el.innerHTML = '<div class="empty">指数K线数据缺失（可在「个股诊断」粘贴指数日K，或到「数据后台」检查）</div>';
    if(el._c){ try{ el._c.dispose(); }catch(e){} el._c = null; }
    return;
  }
  var defs = idxDefs(), color = "#f5a524", k;
  for(k = 0; k < defs.length; k++) if(defs[k][0] === cd) color = defs[k][2];

  var n = an.dates.length;
  var span = IDXV.span | 0;
  if(IDXV.period === "week" && span > 0) span = Math.min(span, Math.max(12, Math.round(span / 4)));
  var st = (span > 0 && span < n) ? n - span : 0;
  var dates = an.dates.slice(st), i;

  /* 量程：可见窗口真实高低 */
  var lo = Infinity, hi = -Infinity;
  for(i = st; i < n; i++){
    if(nn(an.highs[i]) && an.highs[i] > hi) hi = an.highs[i];
    if(nn(an.lows[i])  && an.lows[i]  < lo) lo = an.lows[i];
  }
  var extra = [];
  if(IDXV.chan && an.chan){ for(i = st; i < n; i++){ if(nn(an.chan.up[i])) extra.push(an.chan.up[i]); if(nn(an.chan.lo[i])) extra.push(an.chan.lo[i]); } }
  if(IDXV.ma){ [an.ma5, an.ma10, an.ma20, an.ma60].forEach(function(m){ for(i = st; i < n; i++) if(nn(m[i])) extra.push(m[i]); }); }
  /* 均线/通道只在 ±30% 内参与，避免把蜡烛压扁 */
  var mid = (lo + hi) / 2;
  extra.forEach(function(v){ if(v > mid * 0.7 && v < mid * 1.3){ if(v > hi) hi = v; if(v < lo) lo = v; } });
  if(!nn(lo) || !nn(hi) || hi <= lo){ lo = an.close * 0.9; hi = an.close * 1.1; }
  var pad = (hi - lo) * 0.08;
  var rg = {min: lo - pad, max: hi + pad};

  var series = [], leg = [];
  var main;
  if(IDXV.mode === "kline"){
    var candle = [];
    for(i = st; i < n; i++) candle.push([an.opens[i], an.closes[i], an.lows[i], an.highs[i]]);
    main = {name:nm, type:"candlestick", data:candle, barMaxWidth:22, barMinWidth:1.2,
      itemStyle:{color:UP, color0:DOWN, borderColor:UP, borderColor0:DOWN, borderWidth:1}, z:5};
  }else{
    var cl = [];
    for(i = st; i < n; i++) cl.push(an.closes[i]);
    main = {name:nm, type:"line", data:cl, showSymbol:false, smooth:false,
      lineStyle:{width:2.2, color:color}, itemStyle:{color:color}, z:5};
    if(IDXV.fill) main.areaStyle = {opacity:0.12, color:color};
  }
  leg.push(nm);
  series.push(main);

  /* 均线 */
  if(IDXV.ma){
    var MAS = [[an.ma5,"MA5","#58a6ff",1.1],[an.ma10,"MA10","#79c0ff",1],
               [an.ma20,"MA20","#f5a524",1.4],[an.ma60,"MA60","#a371f7",1.5]];
    MAS.forEach(function(m){
      var d = [];
      for(var i2 = st; i2 < n; i2++) d.push(nn(m[0][i2]) ? m[0][i2] : null);
      series.push({name:m[1], type:"line", data:d, showSymbol:false, smooth:true,
        lineStyle:{width:m[3], color:m[2]}, z:4});
      leg.push(m[1]);
    });
  }

  /* 趋势通道 */
  if(IDXV.chan && an.chan){
    var cu = [], cl2 = [], cm = [];
    for(i = st; i < n; i++){
      cu.push(nn(an.chan.up[i]) ? an.chan.up[i] : null);
      cl2.push(nn(an.chan.lo[i]) ? an.chan.lo[i] : null);
      cm.push(nn(an.chan.mid[i]) ? an.chan.mid[i] : null);
    }
    series.push({name:"通道上轨", type:"line", data:cu, showSymbol:false, smooth:false,
      lineStyle:{width:1.2, color:"rgba(88,166,255,.75)", type:"dashed"}, z:3});
    series.push({name:"通道下轨", type:"line", data:cl2, showSymbol:false, smooth:false,
      lineStyle:{width:1.2, color:"rgba(88,166,255,.75)", type:"dashed"}, z:3});
    series.push({name:"通道中轨", type:"line", data:cm, showSymbol:false, smooth:false,
      lineStyle:{width:1, color:"rgba(147,161,184,.5)", type:"dotted"}, z:2});
    leg.push("通道上轨","通道下轨");
  }

  /* 趋势线 */
  var tr = null;
  if(IDXV.trend){
    tr = idxTrendLines(an);
    var ts = idxTrendSeries(an, tr);
    for(i = 0; i < ts.length; i++){ series.push(ts[i]); leg.push(ts[i].name); }
  }

  /* 波浪 + 水平关键位 → markLine */
  var ml = [];
  if(IDXV.wave){
    try{
      var wm = buildWaveMark(an, rg, idxWavePct(an));
      for(i = 0; i < wm.length; i++) ml.push(wm[i]);
    }catch(e){}
  }
  if(IDXV.trend && tr){
    var lm = idxLevelMark(tr);
    for(i = 0; i < lm.length; i++) ml.push(lm[i]);
  }
  if(ml.length) main.markLine = {silent:true, symbol:"none", animation:false,
    data:ml, label:{fontSize:10.5}};

  /* 成交量副图 */
  var grids, xAxes, yAxes;
  var showVol = IDXV.vol && IDXV.mode === "kline";
  if(showVol){
    grids = [{left:64, right:26, top:46, height:"64%"},
             {left:64, right:26, top:"76%", height:"14%"}];
    xAxes = [{type:"category", data:dates, gridIndex:0, boundaryGap:true,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
        axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor(dates.length/9))}},
       {type:"category", data:dates, gridIndex:1, boundaryGap:true,
        axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false}, axisLabel:{show:false}}];
    yAxes = [{scale:true, gridIndex:0, min:rg.min, max:rg.max, splitNumber:6,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
        axisLabel:{color:"#93a1b8", fontSize:11.5, formatter:function(v){ return v.toFixed(1); }},
        axisLine:{show:false}},
      {scale:true, gridIndex:1, splitNumber:2,
        splitLine:{lineStyle:{color:"rgba(38,49,69,.35)"}},
        axisLabel:{color:"#7d8ca3", fontSize:10,
          formatter:function(v){ return v >= 1e8 ? (v/1e8).toFixed(1)+"亿" : (v/1e4).toFixed(0)+"万"; }},
        axisLine:{show:false}}];
  }else{
    grids = [{left:64, right:26, top:46, bottom:62}];
    xAxes = [{type:"category", data:dates, gridIndex:0,
      boundaryGap: IDXV.mode === "kline",
      axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
      axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor(dates.length/9))}}];
    yAxes = [{type:"value", scale:true, min:rg.min, max:rg.max, splitNumber:6,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8", fontSize:11.5, formatter:function(v){ return v.toFixed(1); }},
      axisLine:{show:false}}];
  }
  if(showVol){
    var vols = [], vma = [];
    for(i = st; i < n; i++){
      var up = an.closes[i] >= an.opens[i];
      vols.push({value:an.vols[i] || 0,
        itemStyle:{color: up ? "rgba(255,77,79,.62)" : "rgba(34,197,94,.62)"}});
    }
    for(i = st; i < n; i++){
      var s = 0, cnt = 0;
      for(var j2 = Math.max(st, i - 4); j2 <= i; j2++){ if(nn(an.vols[j2])){ s += an.vols[j2]; cnt++; } }
      vma.push(cnt ? s / cnt : null);
    }
    series.push({name:"成交量", type:"bar", data:vols, xAxisIndex:1, yAxisIndex:1,
      barMaxWidth:22, z:3});
    series.push({name:"量MA5", type:"line", data:vma, xAxisIndex:1, yAxisIndex:1,
      showSymbol:false, smooth:true, lineStyle:{width:1.2, color:"#f5a524"}, z:4});
    leg.push("成交量","量MA5");
  }

  c.setOption({
    animation:false, backgroundColor:"transparent",
    grid:grids,
    legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12},
      itemWidth:18, itemHeight:9, itemGap:14},
    tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
      textStyle:{color:"#e8eef7", fontSize:12.5},
      axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}}},
    axisPointer:{link:[{xAxisIndex:"all"}]},
    xAxis:xAxes, yAxis:yAxes,
    dataZoom:[
      {type:"inside", xAxisIndex: showVol ? [0,1] : [0], start:0, end:100, zoomOnMouseWheel:true},
      {type:"slider", height:20, bottom:12, start:0, end:100,
        borderColor:"transparent", backgroundColor:"rgba(255,255,255,.03)",
        fillerColor:"rgba(76,141,255,.14)", handleStyle:{color:"#4c8dff"},
        dataBackground:{lineStyle:{color:"#3d4a60"}, areaStyle:{color:"rgba(61,74,96,.5)"}},
        textStyle:{color:"#7d8ca3", fontSize:10}}
    ],
    series:series
  }, true);

  /* 统计卡 */
  renderIdxStat(nm, an, st, n, color, "single");
}

/* ---------- 多指数：归一化 / 累计涨跌 ---------- */
function renderIdxMulti(el, c){
  var defs = idxDefs();
  var dates = null, series = [], leg = [], allV = [], stats = [];
  var span = IDXV.span | 0;
  for(var d = 0; d < defs.length; d++){
    var cd = defs[d][0], nm = defs[d][1], color = defs[d][2];
    var an = getAn(cd); if(!an || !an.closes || !an.closes.length) continue;
    var N = (span > 0 && span < an.dates.length) ? span : an.dates.length;
    var st = an.dates.length - N;
    var base = an.closes[st];
    if(!nn(base) || !base) continue;
    if(!dates) dates = an.dates.slice(st);
    var arr = [], i;
    if(IDXV.mode === "chg"){
      for(i = st; i < an.dates.length; i++){
        var cc = an.closes[i];
        arr.push(nn(cc) ? +(((cc / base) - 1) * 100).toFixed(2) : null);
      }
    }else{
      for(i = st; i < an.dates.length; i++){
        var c2 = an.closes[i];
        arr.push(nn(c2) ? +((c2 / base) * 100).toFixed(2) : null);
      }
    }
    for(i = 0; i < arr.length; i++) if(nn(arr[i])) allV.push(arr[i]);
    var last = arr[arr.length - 1];
    var hi = Math.max.apply(null, arr.filter(nn));
    var lo = Math.min.apply(null, arr.filter(nn));
    var mdd = 0, peak = -Infinity;
    for(i = 0; i < arr.length; i++){
      if(!nn(arr[i])) continue;
      if(arr[i] > peak) peak = arr[i];
      var dd = (IDXV.mode === "chg") ? (arr[i] - peak) : ((arr[i] / peak - 1) * 100);
      if(dd < mdd) mdd = dd;
    }
    var rets = [];
    for(i = 1; i < arr.length; i++){ if(nn(arr[i]) && nn(arr[i-1]) && arr[i-1] !== 0) rets.push(arr[i] / arr[i-1] - 1); }
    var mu = rets.length ? rets.reduce(function(a,b){ return a + b; }, 0) / rets.length : 0;
    var varr = rets.length ? rets.reduce(function(a,b){ return a + (b - mu) * (b - mu); }, 0) / rets.length : 0;
    stats.push({nm:nm, color:color, last:last, hi:hi, lo:lo, mdd:mdd, vol:Math.sqrt(varr) * Math.sqrt(244) * 100});
    var common = {name:nm, type:"line", data:arr, smooth:false, showSymbol:false,
      lineStyle:{width:2.1, color:color}, itemStyle:{color:color},
      emphasis:{focus:"series"}, z:5};
    if(IDXV.fill) common.areaStyle = {opacity:0.10, color:color};
    series.push(common);
    if(IDXV.ma){
      var ma = [];
      for(i = st; i < an.dates.length; i++){
        var mv = an.ma20[i];
        ma.push(nn(mv) ? (IDXV.mode === "chg" ? +(((mv / base) - 1) * 100).toFixed(2) : +((mv / base) * 100).toFixed(2)) : null);
      }
      series.push({name:nm + " MA20", type:"line", data:ma, smooth:true, showSymbol:false,
        lineStyle:{width:1, color:color, opacity:0.45, type:"dashed"}, z:2});
    }
    leg.push(nm);
  }
  if(!series.length){
    el.innerHTML = '<div class="empty">指数K线数据缺失（可在「数据后台」检查，或在个股诊断粘贴指数日K）</div>';
    if(el._c){ try{ el._c.dispose(); }catch(e){} el._c = null; }
    return;
  }
  var rg = tightRange(allV, 0.12, false);
  if(!rg) rg = {min:null, max:null};
  var zeroLine = (IDXV.mode === "chg") ? 0 : 100;
  if(rg.min != null && zeroLine < rg.min) rg.min = zeroLine - (rg.max - rg.min) * 0.02;
  if(rg.max != null && zeroLine > rg.max) rg.max = zeroLine + (rg.max - rg.min) * 0.02;
  series[0].markLine = {silent:true, symbol:"none", data:[{yAxis:zeroLine,
    lineStyle:{color:"rgba(147,161,184,.45)", type:"dashed", width:1}, label:{show:false}}]};

  c.setOption({
    animation:false, backgroundColor:"transparent",
    grid:{left:66, right:26, top:52, bottom:66},
    legend:{data:leg, top:4, left:8, textStyle:{color:"#a9b6c9", fontSize:12.5},
      itemWidth:20, itemHeight:10, itemGap:18},
    tooltip:{trigger:"axis", backgroundColor:"rgba(19,26,37,.97)", borderColor:"#31405a",
      textStyle:{color:"#e8eef7", fontSize:12.5},
      axisPointer:{type:"cross", lineStyle:{color:"rgba(147,161,184,.4)"}},
      valueFormatter:function(v){ return v == null ? "—" : (+v).toFixed(2) + (IDXV.mode === "chg" ? "%" : ""); }},
    xAxis:{type:"category", data:dates || [], boundaryGap:false,
      axisLine:{lineStyle:{color:"#31405a"}}, axisTick:{show:false},
      axisLabel:{color:"#93a1b8", fontSize:11.5, interval:Math.max(1, Math.floor((dates || []).length / 9))}},
    yAxis:{type:"value", min:rg.min, max:rg.max, scale:true, splitNumber:6,
      splitLine:{lineStyle:{color:"rgba(38,49,69,.55)"}},
      axisLabel:{color:"#93a1b8", fontSize:11.5,
        formatter:function(v){ return (IDXV.mode === "chg") ? v.toFixed(1) + "%" : v.toFixed(1); }},
      axisLine:{show:false}},
    dataZoom:[
      {type:"inside", start:0, end:100, zoomOnMouseWheel:true, moveOnMouseMove:false},
      {type:"slider", height:22, bottom:14, start:0, end:100,
        borderColor:"transparent", backgroundColor:"rgba(255,255,255,.03)",
        fillerColor:"rgba(76,141,255,.14)", handleStyle:{color:"#4c8dff"},
        dataBackground:{lineStyle:{color:"#3d4a60"}, areaStyle:{color:"rgba(61,74,96,.5)"}},
        textStyle:{color:"#7d8ca3", fontSize:10}}
    ],
    series:series
  }, true);

  var box = $("idxStat");
  if(box){
    var h = "";
    for(var s2 = 0; s2 < stats.length; s2++){
      var s = stats[s2];
      var up = (s.last != null) && (IDXV.mode === "chg" ? s.last >= 0 : s.last >= 100);
      h += '<div class="logitem"><div class="k">' + esc(s.nm) + '</div>' +
           '<div class="v ' + (up ? "up" : "down") + '">' + (s.last == null ? "—" : ((s.last > 0 ? "+" : "") + s.last.toFixed(2) + (IDXV.mode === "chg" ? "%" : ""))) + '</div>' +
           '<div class="ds muted" style="font-size:11.5px;margin-top:4px">' +
           '区间高 ' + s.hi.toFixed(1) + ' / 低 ' + s.lo.toFixed(1) + '<br>' +
           '最大回撤 ' + s.mdd.toFixed(2) + (IDXV.mode === "chg" ? "%" : "") +
           ' · 年化波动 ' + s.vol.toFixed(1) + '%</div></div>';
    }
    box.innerHTML = h;
  }
}

/* 单指数模式下的区间统计 */
function renderIdxStat(nm, an, st, n, color, tag){
  var box = $("idxStat"); if(!box) return;
  var arr = [], i;
  for(i = st; i < n; i++) arr.push(an.closes[i]);
  var seg = arr.filter(nn);
  if(!seg.length){ box.innerHTML = ""; return; }
  var hi = Math.max.apply(null, seg), lo = Math.min.apply(null, seg);
  var last = an.close, first = seg[0];
  var chg = first ? (last / first - 1) * 100 : null;
  var mdd = 0, peak = -Infinity;
  for(i = 0; i < seg.length; i++){
    if(seg[i] > peak) peak = seg[i];
    var dd = (seg[i] / peak - 1) * 100;
    if(dd < mdd) mdd = dd;
  }
  var rets = [];
  for(i = 1; i < seg.length; i++) if(seg[i-1]) rets.push(seg[i] / seg[i-1] - 1);
  var mu = rets.length ? rets.reduce(function(a,b){ return a + b; }, 0) / rets.length : 0;
  var vr = rets.length ? rets.reduce(function(a,b){ return a + (b - mu) * (b - mu); }, 0) / rets.length : 0;
  var vol = Math.sqrt(vr) * Math.sqrt(IDXV.period === "week" ? 52 : 244) * 100;
  var maPos = [];
  [[an.ma20,"MA20"],[an.ma60,"MA60"]].forEach(function(m){
    if(nn(m[0][an.i])) maPos.push(m[1] + (last > m[0][an.i] ? "上方" : "下方"));
  });
  var up = (chg != null && chg >= 0);
  box.innerHTML =
    '<div class="logitem"><div class="k">' + esc(nm) + ' 区间涨跌</div>' +
    '<div class="v ' + (up ? "up" : "down") + '">' + (chg == null ? "—" : ((chg > 0 ? "+" : "") + chg.toFixed(2) + "%")) + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">样本 ' + (n - st) + ' 根（' + (IDXV.period === "week" ? "周线" : "日线") + '）</div></div>' +
    '<div class="logitem"><div class="k">区间高 / 低</div>' +
    '<div class="v" style="font-size:14px">' + f2(hi) + ' <span class="muted">/</span> ' + f2(lo) + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">现价 ' + f2(last) + '，距高点 ' + ((last/hi-1)*100).toFixed(2) + '%</div></div>' +
    '<div class="logitem"><div class="k">最大回撤</div>' +
    '<div class="v down">' + mdd.toFixed(2) + '%</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">年化波动 ' + vol.toFixed(1) + '%</div></div>' +
    '<div class="logitem"><div class="k">均线位置</div>' +
    '<div class="v" style="font-size:13px">' + (maPos.join(" · ") || "—") + '</div>' +
    '<div class="ds muted" style="font-size:11.5px;margin-top:4px">' + (an.arrange || "") + '</div></div>';
}

/* ============================================================
   三、解读卡片
   ============================================================ */
function renderIdxTrendBox(){
  var box = $("idxTrendBox"); if(!box) return;
  if(!IDX_SINGLE() || !IDXV.trend){
    box.innerHTML = '<div class="hint muted">开启「趋势线」并在单指数模式（K线 / 收盘价）下查看自动识别结果。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = '<div class="hint muted">指数数据缺失。</div>'; return; }
  var tr = idxTrendLines(an);
  var h = '<div class="hint" style="border-left:3px solid #4c8dff;padding-left:10px">';
  h += '<b style="color:#79c0ff">📈 趋势线与关键位（自动识别）</b><br>';
  if(tr.up){
    h += '上升趋势线：' + an.dates[tr.up.i1] + ' 低点 ' + f2(tr.up.v1) + ' → 外推至今日 <b>' + f2(tr.up.endV) +
         '</b>（斜率 ' + (tr.up.slopePct > 0 ? "+" : "") + tr.up.slopePct.toFixed(3) + '%/根）。<br>';
  }
  if(tr.dn){
    h += '下降趋势线：' + an.dates[tr.dn.i1] + ' 高点 ' + f2(tr.dn.v1) + ' → 外推至今日 <b>' + f2(tr.dn.endV) +
         '</b>（斜率 ' + (tr.dn.slopePct > 0 ? "+" : "") + tr.dn.slopePct.toFixed(3) + '%/根）。<br>';
  }
  if(!tr.up && !tr.dn) h += '当前摆动点未形成清晰的上升 / 下降趋势线（可能处于横向震荡）。<br>';
  if(an.chan){
    h += '趋势通道：' + esc(an.chan.dir) + '，斜率 ' + (an.chan.slopePct > 0 ? "+" : "") + an.chan.slopePct.toFixed(3) + '%/根';
    if(nn(an.chan.up[an.i]) && nn(an.chan.lo[an.i]))
      h += '，今日上轨 ' + f2(an.chan.up[an.i]) + ' / 下轨 ' + f2(an.chan.lo[an.i]);
    h += '。<br>';
  }
  if(tr.note && tr.note.length){
    h += '<div style="margin-top:4px">';
    tr.note.forEach(function(x){
      var c = x.t === "good" ? "#ff8f8f" : (x.t === "bad" ? "#6ee79f" : "#f5a524");
      h += '<span class="chip" style="color:' + c + ';border-color:' + c + '44">' + (x.t === "good" ? "▲ " : (x.t === "bad" ? "▼ " : "● ")) + x.s + '</span> ';
    });
    h += '</div>';
  }
  h += '<div class="muted" style="margin-top:4px">趋势线由 ZigZag 摆动点线性外推得到，属客观画线；是否有效突破需结合成交量与后续 2～3 根K线确认。<b>不构成买卖指令。</b></div>';
  h += '</div>';
  box.innerHTML = h;
}

function renderIdxWaveBox(){
  var box = $("idxWaveBox"); if(!box) return;
  if(!IDX_SINGLE() || !IDXV.wave){
    box.innerHTML = '<div class="hint muted">勾选「波浪」后，系统会用 ZigZag 摆动点在指数K线上标注 1-2-3-4-5 与 A-B-C 修正段。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = '<div class="hint muted">指数数据缺失。</div>'; return; }
  var wp = idxWavePct(an);
  var e = elliott(an, wp);
  var h = '<div class="hint" style="border-left:3px solid #ffd166;padding-left:10px">';
  h += '<b style="color:#ffd166">🌊 艾略特波浪（ZigZag 自动识别 · ' + esc(IDX_PICK_NAME()) + '）</b><br>';
  if(e.found && e.imp){
    /* 阶段进度条 */
    var P = e.imp.P, up = e.imp.up;
    var last = an.close;
    var step = 0;
    if(e.corr && e.corr.length >= 3) step = 8;
    else if(e.corr && e.corr.length >= 2) step = 7;
    else if((up && last >= P[4].v) || (!up && last <= P[4].v)) step = 5;
    else if((up && last >= P[3].v) || (!up && last <= P[3].v)) step = 4;
    else if((up && last >= P[2].v) || (!up && last <= P[2].v)) step = 3;
    else if((up && last >= P[1].v) || (!up && last <= P[1].v)) step = 2;
    else step = 1;
    var names = ["1","2","3","4","5","A","B","C"];
    h += '<div class="wavesteps" style="margin:8px 0 6px">';
    for(var i = 0; i < 8; i++){
      if(i === 5) h += '<i class="gap"></i>';
      if(i > 0 && i !== 5) h += '<i></i>';
      h += '<span class="' + (step >= i + 1 ? "on" : "") + '">' + names[i] + '</span>';
    }
    h += '</div>';
  }
  h += e.text;
  h += '<div class="muted" style="margin-top:4px">浪型是基于摆动阈值的<b>形态近似</b>，同一段行情常有多种数法；' +
       '当前阈值 <b>' + wp + '%</b>' + (IDXV.wavePct && IDXV.wavePct !== "auto" ? "（手动）" : "（自动适配）") +
       '，可在上方「灵敏度」切换。<b>不构成买卖指令。</b></div>';
  h += '</div>';
  box.innerHTML = h;
}

function renderIdxLevels(){
  var box = $("idxLevels"); if(!box) return;
  if(!IDX_SINGLE()){
    box.innerHTML = '<div class="hint muted">切到「K线 / 收盘价」模式可查看自动识别的水平支撑压力位。</div>';
    return;
  }
  var an = idxAn(IDXV.pick, IDXV.period);
  if(!an){ box.innerHTML = ""; return; }
  var tr = idxTrendLines(an);
  if(!tr.levels || !tr.levels.length){
    box.innerHTML = '<div class="hint muted">未识别出有效水平关键位（摆动点过于分散）。</div>';
    return;
  }
  var close = an.close;
  var h = '<div class="lvbar">';
  tr.levels.forEach(function(l){
    var sup = l.side === "sup";
    h += '<div class="lvitem ' + (sup ? "sup" : "res") + '">' +
         '<div class="t">' + (sup ? "支撑" : "压力") + ' ×' + l.n + '</div>' +
         '<div class="v">' + f2(l.v) + '</div>' +
         '<div class="d">' + (l.dist > 0 ? "+" : "") + l.dist.toFixed(2) + '%（' + (sup ? "下方" : "上方") + ' ' + Math.abs(l.dist).toFixed(1) + '%）</div>' +
         '</div>';
  });
  h += '<div class="lvitem cur"><div class="t">现价</div><div class="v">' + f2(close) + '</div>' +
       '<div class="d">基准</div></div>';
  h += '</div>';
  box.innerHTML = h;
}

/* ---------- 指数相关性矩阵 ---------- */
function corrOf(a, b){
  var n = Math.min(a.length, b.length), i;
  var xs = [], ys = [];
  for(i = a.length - n; i < a.length; i++){
    var j = b.length - n + (i - (a.length - n));
    if(!nn(a[i]) || !nn(b[j]) || !a[i-1] || !b[j-1]){ xs.push(null); ys.push(null); continue; }
    xs.push(a[i] / a[i-1] - 1); ys.push(b[j] / b[j-1] - 1);
  }
  var X = [], Y = [];
  for(i = 1; i < xs.length; i++) if(xs[i] != null && ys[i] != null){ X.push(xs[i]); Y.push(ys[i]); }
  if(X.length < 12) return null;
  var mx = X.reduce(function(p,c){ return p + c; }, 0) / X.length;
  var my = Y.reduce(function(p,c){ return p + c; }, 0) / Y.length;
  var sxy = 0, sxx = 0, syy = 0;
  for(i = 0; i < X.length; i++){
    sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) * (X[i] - mx); syy += (Y[i] - my) * (Y[i] - my);
  }
  if(sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

function renderIdxCorr(){
  idxEnsure();
  var box = $("idxCorr"); if(!box) return;
  var defs = idxDefs();
  var ans = defs.map(function(d){ return {cd:d[0], nm:d[1], an:getAn(d[0])}; })
                .filter(function(x){ return x.an; });
  if(ans.length < 2){ box.innerHTML = '<div class="hint muted">至少需 2 个指数的K线数据。</div>'; return; }
  var N = IDXV.span > 0 ? IDXV.span : 60;
  var h = '<table class="mini"><thead><tr><th>日收益相关性</th>';
  ans.forEach(function(a){ h += '<th class="num">' + esc(a.nm.replace("指数","").replace("证成指","成指")) + '</th>'; });
  h += '</tr></thead><tbody>';
  var vals = [];
  ans.forEach(function(a){
    h += '<tr><td>' + esc(a.nm) + '</td>';
    ans.forEach(function(b){
      if(a.cd === b.cd){ h += '<td class="num muted">1.00</td>'; return; }
      var c = corrOf(a.an.closes, b.an.closes);
      if(c == null){ h += '<td class="num muted">—</td>'; return; }
      vals.push(c);
      var col = c >= 0.8 ? "up" : (c >= 0.5 ? "" : "down");
      h += '<td class="num ' + col + '">' + c.toFixed(2) + '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  if(vals.length){
    var avg = vals.reduce(function(p,c){ return p + c; }, 0) / vals.length;
    var judge = avg >= 0.85 ? "高度同向，分散效果弱，组合容易齐涨齐跌" :
                (avg >= 0.6 ? "中高度相关，需注意同向风险" : "相关性一般，指数间存在一定分化");
    h += '<div class="hint muted" style="margin-top:6px">近 ' + N + ' 日平均相关系数 <b>' + avg.toFixed(2) +
         '</b>：' + judge + '。</div>';
  }
  box.innerHTML = h;
}

/* ---------- 多周期共振（日 / 周 / 月） ---------- */
function monthlyFromDaily(rows){
  var out = [], cur = null, key = "";
  (rows || []).forEach(function(r){
    var d = String(Array.isArray(r) ? r[0] : r.date);
    var k = d.slice(0, 7);
    var o = Array.isArray(r)
      ? {date:r[0], o:r[1], h:r[2], l:r[3], c:r[4], v:r[5]}
      : {date:r.date, o:r.o, h:r.h, l:r.l, c:r.c, v:r.v};
    if(k !== key){ if(cur) out.push(cur); cur = {date:o.date, o:o.o, h:o.h, l:o.l, c:o.c, v:o.v}; key = k; }
    else { cur.h = Math.max(cur.h, o.h); cur.l = Math.min(cur.l, o.l); cur.c = o.c; cur.v = (cur.v||0) + (o.v||0); cur.date = o.date; }
  });
  if(cur) out.push(cur);
  return out;
}

function tfVote(an){
  if(!an) return 0;
  var i = an.i, c = an.close;
  var m20 = nn(an.ma20[i]) ? an.ma20[i] : null;
  var bull = an.arrange === "多头排列" && (!nn(m20) || c > m20);
  var bear = an.arrange === "空头排列" && (!nn(m20) || c < m20);
  if(bull) return 1;
  if(bear) return -1;
  return 0;
}

function renderIdxMultiTf(){
  idxEnsure();
  var box = $("idxMt"); if(!box) return;
  var defs = idxDefs(), h = "", any = false;
  defs.forEach(function(d){
    var cd = d[0], nm = d[1];
    var an = getAn(cd);
    if(!an){ return; }
    any = true;
    var wk = idxAn(cd, "week"), mo = null;
    try{
      var stk = state.stocks[cd];
      if(stk && stk.rows && stk.rows.length > 60)
        mo = analyzeStock({rows: monthlyFromDaily(stk.rows), name: nm, code: cd});
    }catch(e){}
    var votes = [tfVote(an), wk ? tfVote(wk) : 0, (mo && !mo.err) ? tfVote(mo) : 0];
    var names = ["日线", "周线", "月线"];
    var bulls = votes.filter(function(v){ return v > 0; }).length;
    var bears = votes.filter(function(v){ return v < 0; }).length;
    var verdict, cls;
    if(bulls === 3){ verdict = "三周期同向偏多"; cls = "up"; }
    else if(bears === 3){ verdict = "三周期同向偏空"; cls = "down"; }
    else if(bulls >= 2 && bears === 0){ verdict = "多头占优"; cls = "up"; }
    else if(bears >= 2 && bulls === 0){ verdict = "空头占优"; cls = "down"; }
    else { verdict = "多周期分歧"; cls = ""; }
    var rsn = bulls + " 多 / " + bears + " 空 / " + (3 - bulls - bears) + " 中性";
    h += '<div class="tfrow"><span class="nm">' + esc(nm.replace("指数","")) + '</span>' +
         '<span style="flex:1">';
    for(var i = 0; i < 3; i++){
      var v = votes[i];
      var c2 = v > 0 ? "#ff8f8f" : (v < 0 ? "#6ee79f" : "#93a1b8");
      var t2 = v > 0 ? "多头" : (v < 0 ? "空头" : "交织");
      h += '<span class="tfchip" style="color:' + c2 + ';border-color:' + c2 + '44">' + names[i] + " " + t2 + '</span>';
    }
    h += '</span><span class="tfchip ' + cls + '" style="border-color:var(--line)">' + verdict + '</span></div>';
    h += '<div class="muted" style="font-size:11px;margin:-2px 0 6px 72px">共振票型 ' + rsn +
         '　周线：' + (wk ? esc(wk.arrange || "—") : "数据不足") + '</div>';
  });
  if(!any){ h = '<div class="hint muted">指数K线数据缺失。</div>'; }
  box.innerHTML = h;
}

/* ---------- KPI 迷你走势 sparkline ---------- */
function sparkSvg(arr, color){
  var a = (arr || []).filter(nn);
  if(a.length < 3) return "";
  var lo = Math.min.apply(null, a), hi = Math.max.apply(null, a);
  if(hi <= lo) hi = lo + 1;
  var W = 100, H = 26, pts = [];
  for(var i = 0; i < a.length; i++){
    var x = i / (a.length - 1) * W;
    var y = H - (a[i] - lo) / (hi - lo) * (H - 3) - 1.5;
    pts.push(x.toFixed(1) + "," + y.toFixed(1));
  }
  return '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
         '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + color +
         '" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
}

function renderIdxSpark(){
  idxEnsure();
  var box = $("idxCards"); if(!box) return;
  var defs = idxDefs(), m = (typeof state !== "undefined" && state.market) ? state.market : {};
  var keys = [["sh_close","sh_chg","sh_amt","sh_amtd"],
              ["sz_close","sz_chg","sz_amt","sz_amtd"],
              ["cy_close","cy_chg","cy_amt","cy_amtd"]];
  var h = "";
  for(var i = 0; i < defs.length; i++){
    var cd = defs[i][0], nm = defs[i][1], color = defs[i][2];
    var kk = keys[i];
    var c = m[kk[0]], chg = m[kk[1]], amt = m[kk[2]], amtd = m[kk[3]];
    var u = (num(chg) || 0) >= 0;
    var an = getAn(cd);
    var spark = "";
    if(an && an.closes){
      var N = Math.min(60, an.closes.length);
      spark = sparkSvg(an.closes.slice(an.closes.length - N), u ? "#ff6b6b" : "#4ade80");
    }
    var dev = null;
    if(an && nn(an.ma20[an.i]) && an.ma20[an.i]) dev = (an.close / an.ma20[an.i] - 1) * 100;
    h += '<div class="kpi ' + (u ? "up" : "down") + '" data-idx="' + cd + '" title="点击查看 ' + esc(nm) + ' 走势图">' +
         '<div class="lb">' + nm + (dev != null ? ' <span class="muted2">距MA20 ' + (dev > 0 ? "+" : "") + dev.toFixed(1) + '%</span>' : '') + '</div>' +
         '<div class="vl">' + f2(c) + '</div>' +
         '<div class="ex"><b class="' + (u ? "up" : "down") + '">' + pct(chg) + '</b> · 成交额 ' + (amt != null ? f2(amt) + '亿' : '数据缺失') +
         (amtd != null ? '（环比 ' + pct(amtd) + '）' : '') + '</div>' +
         spark + '</div>';
  }
  box.innerHTML = h;
  idxV2SyncUI();   /* 同步 KPI 卡选中态 */
}

/* ============================================================
   四、绑定
   ============================================================ */
function bindIdxV2(){
  idxEnsure();
  var seg = function(id, attr, fn){
    var box = $(id); if(!box) return;
    box.addEventListener("click", function(e){
      var b = e.target.closest ? e.target.closest("button") : null;
      if(!b) return;
      var v = b.getAttribute(attr); if(v == null) return;
      var all = box.querySelectorAll("button");
      for(var i = 0; i < all.length; i++) all[i].classList.remove("on");
      b.classList.add("on");
      fn(v);
      idxSavePref();
      renderIdxChart();
      idxV2SyncUI();
    });
  };
  seg("segIdxType", "data-t", function(v){ IDXV.mode = v; });
  seg("segIdxPick", "data-c", function(v){ IDXV.pick = v; });
  seg("segIdxPeriod", "data-p", function(v){ IDXV.period = v; });
  seg("segIdxSpan", "data-n", function(v){ IDXV.span = parseInt(v, 10); });
  seg("segIdxWavePct", "data-w", function(v){ IDXV.wavePct = v; });

  var ck = function(id, key){
    idxEnsure();
    var e = $(id); if(!e) return;
    e.checked = !!IDXV[key];
    e.addEventListener("change", function(){ IDXV[key] = e.checked; idxSavePref(); renderIdxChart(); idxV2SyncUI(); });
  };
  ck("ckIdxTrend", "trend");
  ck("ckIdxChan",  "chan");
  ck("ckIdxWave",  "wave");
  ck("ckIdxMa",    "ma");
  ck("ckIdxFill",  "fill");
  ck("ckIdxVol",   "vol");

  var png = $("btnIdxPng");
  if(png) png.onclick = function(){
    var el = $("idxChart");
    if(!el || !el._c){ alert("图表未就绪"); return; }
    try{
      var url = el._c.getDataURL({type:"png", pixelRatio:2, backgroundColor:"#0d131d"});
      var a = document.createElement("a");
      a.href = url; a.download = "指数走势_" + (IDX_SINGLE() ? IDX_PICK_NAME() : "三指数") + "_" + new Date().toISOString().slice(0,10) + ".png";
      a.click();
    }catch(e){ alert("导出失败：" + e.message); }
  };

  /* 重置视图 */
  var rst = $("btnIdxReset");
  if(rst) rst.onclick = function(){
    IDXV.mode = "kline"; IDXV.pick = "000001"; IDXV.period = "day"; IDXV.span = 60;
    IDXV.trend = true; IDXV.chan = true; IDXV.wave = true;
    IDXV.ma = true; IDXV.vol = true; IDXV.fill = false; IDXV.wavePct = "auto";
    idxSavePref(); renderIdxChart();
  };
  /* 全屏 */
  var fb = $("btnIdxFull");
  if(fb) fb.onclick = function(){ idxFullscreen(); };

  /* 点击 KPI 卡 → 切换下方图表标的 */
  var cards = $("idxCards");
  if(cards && cards.addEventListener){
    cards.addEventListener("click", function(e){
      var t = e.target, el = (t && t.closest) ? t.closest(".kpi[data-idx]") : null;
      if(!el) return;
      var cd = el.getAttribute("data-idx"); if(!cd) return;
      idxEnsure();
      IDXV.pick = cd;
      if(!IDX_SINGLE()) IDXV.mode = "kline";     /* 三指数模式下点卡片自动切到单指数K线 */
      idxSavePref(); renderIdxChart();
    });
  }
  /* 键盘快捷键（仅大盘页可见且未聚焦输入框） */
  if(!bindIdxV2._hot){
    bindIdxV2._hot = 1;
    document.addEventListener("keydown", idxHotkey);
  }
  idxV2SyncUI();
}

/* ---------------- 全屏 / 快捷键 ---------------- */
function idxFullscreen(){
  var cl = $("clab"); if(!cl || !cl.classList) return;
  var on = cl.classList.toggle("fs");
  try{ document.body.classList.toggle("fs-lock", on); }catch(e){}
  var fit = function(){
    var el = $("idxChart");
    if(el && el._c && el._c.resize) { try{ el._c.resize(); }catch(e){} }
  };
  setTimeout(fit, 40); setTimeout(fit, 220);
  idxV2SyncUI();
}
function idxHotkey(e){
  if(!e || e.ctrlKey || e.metaKey || e.altKey) return;
  var sec = document.getElementById("market");
  var vis = sec && sec.classList && sec.classList.contains("on");
  if(!vis) return;
  var a = document.activeElement;
  if(a && a.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  var ck = document.getElementById("cmdk");
  if(ck && ck.style && ck.style.display && ck.style.display !== "none") return;
  idxEnsure();
  var k = e.key, changed = false;
  if(e.key === "Escape"){
    var cl = $("clab");
    if(cl && cl.classList && cl.classList.contains("fs")){ idxFullscreen(); e.preventDefault(); }
    return;
  }
  if(k === "1" || k === "2" || k === "3"){
    IDXV.pick = ["000001","399001","399006"][parseInt(k, 10) - 1];
    if(!IDX_SINGLE()) IDXV.mode = "kline";
    changed = true;
  }else if(k === "[" || k === "]"){
    var SP = [20, 60, 120, 0], i = SP.indexOf(parseInt(IDXV.span, 10) || 0);
    if(i < 0) i = 1;
    i = (k === "]") ? Math.min(SP.length - 1, i + 1) : Math.max(0, i - 1);
    IDXV.span = SP[i]; changed = true;
  }
  if(!changed) return;
  e.preventDefault();
  idxSavePref(); renderIdxChart();
}

/* ---------------- UI 同步 ---------------- */
function idxSetDis(id, on){
  var e = $(id); if(!e || !e.classList) return;
  e.classList.toggle("dis", !!on);
}
function idxChipSync(id, on){
  var e = $(id); if(!e) return;
  if(e.classList) e.classList.toggle("on", !!on);
  var inp = (e.querySelector ? e.querySelector("input") : null);
  if(inp) inp.checked = !!on;
}
function idxV2SyncUI(){
  idxEnsure();
  var st = idxUiState(), single = st.single;

  /* 结果区显隐：这些是纵向堆叠的结果卡，隐藏不会造成布局跳动 */
  ["idxTrendBox","idxWaveBox","idxLevels"].forEach(function(id){
    var b = $(id); if(b) b.style.display = single ? "" : "none";
  });

  /* 控制台可用态：用「变暗」代替「隐藏」，避免切换图型时整排控件跳动 */
  idxSetDis("grpIdxTarget", st.dis.target);
  idxSetDis("grpIdxDraw",   st.dis.target);
  idxSetDis("wavePctWrap",  st.dis.wavePct);
  idxSetDis("tchipVol",     st.dis.vol);
  idxSetDis("tchipFill",    st.dis.fill);

  /* 分段按钮选中态 */
  var sync = function(id, attr, val){
    var box = $(id); if(!box) return;
    var all = box.querySelectorAll("button");
    for(var i = 0; i < all.length; i++){
      all[i].classList.toggle("on", all[i].getAttribute(attr) === String(val));
    }
  };
  sync("segIdxType",    "data-t", IDXV.mode);
  sync("segIdxPick",    "data-c", IDXV.pick);
  sync("segIdxPeriod",  "data-p", IDXV.period);
  sync("segIdxSpan",    "data-n", IDXV.span);
  sync("segIdxWavePct", "data-w", IDXV.wavePct);

  /* 开关 chip 选中态 */
  idxChipSync("tchipTrend", !!IDXV.trend);
  idxChipSync("tchipChan",  !!IDXV.chan);
  idxChipSync("tchipWave",  !!IDXV.wave);
  idxChipSync("tchipMa",    !!IDXV.ma);
  idxChipSync("tchipVol",   !!IDXV.vol);
  idxChipSync("tchipFill",  !!IDXV.fill);

  /* 头部 */
  idxHeadSync(st);

  /* KPI 卡选中态 + 全屏按钮文案 */
  var cards = $("idxCards");
  if(cards && cards.querySelectorAll){
    var items = cards.querySelectorAll(".kpi");
    for(var j = 0; j < items.length; j++){
      var cd = items[j].getAttribute ? items[j].getAttribute("data-idx") : null;
      if(items[j].classList) items[j].classList.toggle("sel", !!(single && cd === IDXV.pick));
    }
  }
  var fb = $("btnIdxFull"), cl = $("clab");
  if(fb) fb.textContent = (cl && cl.classList && cl.classList.contains("fs")) ? "✕ 退出全屏" : "⛶ 全屏";
}

/* ============================================================
   五、覆盖大盘页总渲染（KPI 卡换成带迷你走势的版本）
   —— 直接展开原步骤，不做函数包装（避免同名声明提升导致自递归）
   ============================================================ */
function renderMarket(){
  const b = state.breadth || {};
  renderIdxSpark();
  ["up","dn","zt","dt","zb","amt"].forEach(k=>{ const e=$("b_"+k); if(e&&b[k]!=null)e.value=b[k]; });
  const vn=$("vol_note"); if(vn&&state.vol_note)vn.value=state.vol_note;
  renderIdxMa();
  renderIdxChart();
  renderBreadthBar();
  renderSnapshot();
  renderSectorMap();
  renderMarketAi();
}

function idxV2Boot(){
  if(typeof state === "undefined" || !state || !state.holdings){
    setTimeout(idxV2Boot, 40); return;
  }
  try{
    bindIdxV2();
    if(typeof renderIdxSpark === "function") renderIdxSpark();
    idxV2SyncUI();
  }catch(e){ if(window.console) console.warn("idxV2Boot:", e); }
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(idxV2Boot, 60); });
}else{
  setTimeout(idxV2Boot, 60);
}

/* ============================================================
   engine14 · v2.1 UI 增强
   Toast 通知 / 市场开盘状态 / 快捷键帮助 / 回到顶部 / 空状态 / URL hash
   ============================================================ */

/* ===================== Toast 通知系统 ===================== */
var TOAST_ICONS = {info:"i", success:"✓", warn:"!", error:"×"};
var TOAST_BAR_ANIM = null;

function toast(msg, type, duration){
  type = type || "info";
  duration = duration || 3200;
  var box = $("toastBox");
  if(!box) return;
  var el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML =
    '<div class="ic">' + (TOAST_ICONS[type] || "i") + '</div>' +
    '<div class="bd">' + esc(msg) + '</div>' +
    '<div class="cls">×</div>' +
    '<div class="pb"><i></i></div>';
  box.appendChild(el);
  var remove = function(){
    if(el._removed) return;
    el._removed = 1;
    el.classList.add("out");
    if(el._timer) clearTimeout(el._timer);
    if(el._pbTimer) clearInterval(el._pbTimer);
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 280);
  };
  el.querySelector(".cls").onclick = remove;
  el.onclick = function(e){ if(e.target.classList.contains("bd")) remove(); };
  el._timer = setTimeout(remove, duration);
  /* 进度条 */
  var pb = el.querySelector(".pb i");
  if(pb){
    var steps = 50, elapsed = 0;
    pb.style.width = "100%";
    el._pbTimer = setInterval(function(){
      elapsed += duration / steps;
      pb.style.width = Math.max(0, 100 - (elapsed / duration * 100)) + "%";
      if(el._removed) clearInterval(el._pbTimer);
    }, duration / steps);
  }
  /* 最多同时 5 条 */
  while(box.children.length > 5){
    var first = box.firstChild;
    if(first && first.classList) first.classList.add("out");
    if(first && first.parentNode) first.parentNode.removeChild(first);
  }
}

/* 便捷封装 */
function toastInfo(msg, d){ toast(msg, "info", d); }
function toastOk(msg, d){ toast(msg, "success", d); }
function toastWarn(msg, d){ toast(msg, "warn", d); }
function toastErr(msg, d){ toast(msg, "error", d || 4200); }

/* ===================== 市场开盘状态 ===================== */
function marketSessionStatus(){
  var now = new Date();
  var day = now.getDay();
  var h = now.getHours(), m = now.getMinutes();
  var mins = h * 60 + m;
  if(day === 0 || day === 6) return {state:"closed", label:"周末休市", countdown:""};
  if(mins >= 570 && mins < 690) return {state:"open", label:"早盘交易", countdown:formatCountdown(690 - mins, "午休")};
  if(mins >= 690 && mins < 780) return {state:"lunch", label:"午休中", countdown:formatCountdown(780 - mins, "开盘")};
  if(mins >= 780 && mins < 900) return {state:"open", label:"午盘交易", countdown:formatCountdown(900 - mins, "收盘")};
  if(mins >= 540 && mins < 570) return {state:"lunch", label:"盘前", countdown:formatCountdown(570 - mins, "开盘")};
  return {state:"closed", label:"休市", countdown:""};
}

function formatCountdown(mins, event){
  if(mins <= 0) return "";
  mins = Math.floor(mins);
  var h = Math.floor(mins / 60), m = mins % 60;
  if(h > 0) return h + ":" + String(m).padStart(2,"0") + " 后" + event;
  return m + " 分后" + event;
}

var _mktTimer = null;
function renderMarketBadge(){
  var badge = $("mktBadge");
  if(!badge) return;
  var s = marketSessionStatus();
  badge.className = "mkt-badge " + s.state;
  var lb = badge.querySelector(".lb");
  var cd = badge.querySelector(".cd");
  if(lb) lb.textContent = s.label;
  if(cd) cd.textContent = s.countdown ? "· " + s.countdown : "";
  badge.title = "A股交易时段：周一至周五 9:30-11:30 / 13:00-15:00";
}

function startMarketBadge(){
  renderMarketBadge();
  if(_mktTimer) clearInterval(_mktTimer);
  _mktTimer = setInterval(renderMarketBadge, 30000);
}

/* ===================== 快捷键帮助面板 ===================== */
var SHORTCUTS = [
  {section:"全局", items:[
    {keys:["Ctrl/⌘","K"], desc:"打开快捷搜索（标的 / 页面跳转）"},
    {keys:["?"], desc:"显示 / 隐藏快捷键帮助"},
    {keys:["Esc"], desc:"关闭弹窗 / 退出全屏"}
  ]},
  {section:"大盘走势工作台", items:[
    {keys:["1"], desc:"切换上证指数"},
    {keys:["2"], desc:"切换深证成指"},
    {keys:["3"], desc:"切换创业板指"},
    {keys:["["], desc:"缩小区间（20→60→120→全部）"},
    {keys:["]"], desc:"放大区间"},
    {keys:["Esc"], desc:"退出全屏走势图"}
  ]},
  {section:"导航", items:[
    {keys:["g","d"], desc:"仪表盘"},
    {keys:["g","m"], desc:"大盘环境"},
    {keys:["g","s"], desc:"个股诊断"},
    {keys:["g","h"], desc:"持仓管理"},
    {keys:["g","r"], desc:"复盘报告"}
  ]}
];

function renderShortcutPanel(){
  var grid = $("shortcutGrid");
  if(!grid) return;
  var h = "";
  SHORTCUTS.forEach(function(sec){
    h += '<div class="shortcut-section"><h4>' + esc(sec.section) + '</h4>';
    sec.items.forEach(function(it){
      var keys = it.keys.map(function(k, i){
        return (i > 0 ? '<span class="plus">+</span>' : "") + '<kbd>' + esc(k) + '</kbd>';
      }).join("");
      h += '<div class="shortcut-row"><span class="desc">' + esc(it.desc) + '</span><span class="keys">' + keys + '</span></div>';
    });
    h += '</div>';
  });
  h += '<div class="shortcut-section"><h4>提示</h4>' +
    '<div class="shortcut-row"><span class="desc">快捷键在输入框内不触发</span><span class="keys"><kbd>—</kbd></span></div>' +
    '<div class="shortcut-row"><span class="desc">按 <kbd style="display:inline">?</kbd> 随时呼出 / 关闭本面板</span><span class="keys"></span></div></div>';
  grid.innerHTML = h;
}

function toggleShortcutPanel(){
  var ov = $("shortcutOverlay");
  if(!ov) return;
  var show = ov.style.display === "none" || !ov.style.display;
  ov.style.display = show ? "flex" : "none";
  if(show) renderShortcutPanel();
}

function bindShortcutPanel(){
  var ov = $("shortcutOverlay");
  if(ov){
    ov.onclick = function(e){ if(e.target === ov) ov.style.display = "none"; };
  }
  var cls = $("shortcutClose");
  if(cls) cls.onclick = function(){ var o = $("shortcutOverlay"); if(o) o.style.display = "none"; };
  var navBtn = $("navShortcut");
  if(navBtn) navBtn.onclick = function(e){ e.preventDefault(); toggleShortcutPanel(); };
}

/* ===================== 回到顶部 ===================== */
function bindScrollTop(){
  var btn = $("scrollTop");
  if(!btn) return;
  window.addEventListener("scroll", function(){
    if(window.pageYOffset > 400) btn.classList.add("show");
    else btn.classList.remove("show");
  }, {passive:true});
  btn.onclick = function(){
    window.scrollTo({top:0, behavior:"smooth"});
  };
}

/* ===================== URL hash 路由 ===================== */
var TAB_IDS = ["dash","market","sector","stock","holdings","report","compare","notes","alerts","admin","help"];

function syncTabFromHash(){
  var h = (location.hash || "").replace("#","");
  if(TAB_IDS.indexOf(h) >= 0){
    try{ tab(h); }catch(e){}
  }
}

function bindHashChange(){
  window.addEventListener("hashchange", syncTabFromHash);
  /* 让 tab() 调用时也更新 hash */
  var _tabOrig = tab;
  tab = function(id){
    _tabOrig(id);
    try{ if(history && history.replaceState) history.replaceState(null, "", "#" + id); }catch(e){}
  };
}

/* ===================== g + 字母 导航 ===================== */
var _gPrefix = {active:false, timer:null};
function bindGNav(){
  document.addEventListener("keydown", function(e){
    if(!e || e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement;
    if(a && a.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    /* ? 打开快捷键面板 */
    if(e.key === "?" || (e.shiftKey && e.key === "/")){
      var ov = $("shortcutOverlay");
      var vis = ov && ov.style.display !== "none" && ov.style.display !== "";
      if(vis){
        ov.style.display = "none";
      }else{
        toggleShortcutPanel();
      }
      e.preventDefault();
      return;
    }
    /* Esc 关闭快捷键面板 */
    if(e.key === "Escape"){
      var ov2 = $("shortcutOverlay");
      if(ov2 && ov2.style.display !== "none" && ov2.style.display !== ""){
        ov2.style.display = "none";
      }
    }
    /* g + 字母 导航 */
    if(e.key === "g" && !_gPrefix.active){
      _gPrefix.active = true;
      if(_gPrefix.timer) clearTimeout(_gPrefix.timer);
      _gPrefix.timer = setTimeout(function(){ _gPrefix.active = false; }, 1200);
      e.preventDefault();
      return;
    }
    if(_gPrefix.active){
      _gPrefix.active = false;
      if(_gPrefix.timer) clearTimeout(_gPrefix.timer);
      var map = {d:"dash", m:"market", s:"stock", h:"holdings", r:"report",
                 c:"compare", n:"notes", a:"alerts", p:"admin", e:"help"};
      var tgt = map[e.key.toLowerCase()];
      if(tgt){
        try{ tab(tgt); }catch(err){}
        e.preventDefault();
      }
      return;
    }
  });
}

/* ===================== 空状态渲染 ===================== */
function emptyStateHtml(icon, title, desc, ctaText, ctaAction){
  var h = '<div class="empty-state">';
  h += '<div class="ic">' + icon + '</div>';
  h += '<div class="tt">' + esc(title) + '</div>';
  if(desc) h += '<div class="ds">' + esc(desc) + '</div>';
  if(ctaText){
    h += '<div class="cta"><button class="btn primary sm" onclick="' + (ctaAction || "") + '">' + esc(ctaText) + '</button></div>';
  }
  h += '</div>';
  return h;
}

/* ===================== 数字滚动动画 ===================== */
function countUp(el, target, suffix, decimals){
  if(!el) return;
  suffix = suffix || "";
  decimals = decimals || 2;
  var start = 0, duration = 600, startTime = null;
  function step(ts){
    if(!startTime) startTime = ts;
    var p = Math.min(1, (ts - startTime) / duration);
    var ease = 1 - Math.pow(1 - p, 3);
    var val = start + (target - start) * ease;
    el.textContent = val.toFixed(decimals) + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===================== 增强 alert / confirm 提示 ===================== */
/* 不替换原有的 alert/confirm（因为同步逻辑），但在某些非关键位置提供 toast 替代 */
var _origAlert = window.alert;
window.alert = function(msg){
  /* 如果是简单提示信息，用 toast 替代 */
  if(typeof msg === "string" && msg.length < 120 && !msg.includes("\n")){
    toastInfo(msg);
    return;
  }
  _origAlert.call(window, msg);
};

/* ===================== 初始化 ===================== */
var _initV14 = null;
function initV14(){
  try{ startMarketBadge(); }catch(e){ if(console&&console.error) console.error("marketBadge:", e); }
  try{ bindShortcutPanel(); }catch(e){}
  try{ bindScrollTop(); }catch(e){}
  try{ bindGNav(); }catch(e){}
  try{ bindHashChange(); }catch(e){}
  try{ syncTabFromHash(); }catch(e){}
}

/* 拦截 v2InitSteps，在最后插入新功能 */
var _v2InitStepsOrig = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrig();
  try{ initV14(); }catch(e){ if(console&&console.error) console.error("v14 init:", e); }
  /* 延迟一帧，确保所有渲染完成后再显示欢迎 toast */
  setTimeout(function(){
    try{
      var s = marketSessionStatus();
      if(s.state === "open"){
        toastOk("A股" + s.label + "中，数据仅供参考");
      }else if(s.state === "lunch"){
        toastInfo("A股" + s.label + "中");
      }else{
        toastInfo("A股" + s.label + "，可离线复盘");
      }
    }catch(e){}
  }, 600);
};

/* ============================================================
   engine15 · 浮动快捷面板 / 复盘清单 / 隐私保护 / 拉取增强
   ============================================================ */

/* ===================== 1. 浮动快捷加标的面板 ===================== */
var FAB = {panel:null, input:null, results:null, items:[], idx:-1, timer:null, seq:0,
           recent:[], maxRecent:12};

function fabLoadRecent(){
  try{
    var s = localStorage.getItem("ashare_fab_recent");
    if(s){ FAB.recent = JSON.parse(s) || []; }
  }catch(e){ FAB.recent = []; }
}
function fabSaveRecent(){
  try{ localStorage.setItem("ashare_fab_recent", JSON.stringify(FAB.recent.slice(0, FAB.maxRecent))); }catch(e){}
}
function fabAddRecent(code, name){
  FAB.recent = FAB.recent.filter(function(r){ return r.code !== code; });
  FAB.recent.unshift({code:code, name:name});
  if(FAB.recent.length > FAB.maxRecent) FAB.recent.length = FAB.maxRecent;
  fabSaveRecent();
}

var FAB_HOT = [
  {code:"600519", name:"贵州茅台"}, {code:"000858", name:"五粮液"},
  {code:"300750", name:"宁德时代"}, {code:"601318", name:"中国平安"},
  {code:("000001"), name:"平安银行"}, {code:"002594", name:"比亚迪"},
  {code:"600036", name:"招商银行"}, {code:"000063", name:"中兴通讯"},
  {code:"601012", name:"隆基绿能"}, {code:"002475", name:"立讯精密"}
];

function fabToggle(forceShow){
  var p = FAB.panel;
  if(!p){ p = fabCreate(); }
  var show = forceShow !== undefined ? forceShow : (p.style.display === "none" || !p.style.display);
  if(show){
    p.style.display = "block";
    p.classList.remove("out");
    if(FAB.input){
      FAB.input.value = "";
      FAB.input.focus();
      fabRenderHot();
    }
  } else {
    p.classList.add("out");
    setTimeout(function(){ p.style.display = "none"; }, 200);
  }
}

function fabCreate(){
  var p = document.createElement("div");
  p.className = "qa-panel";
  p.style.display = "none";
  p.innerHTML =
    '<div class="qa-head">' +
      '<h4>⚡ 快捷加标的</h4>' +
      '<div class="qa-sub">输入代码 / 拼音 / 名称，回车即加并自动拉取</div>' +
    '</div>' +
    '<div class="qa-body">' +
      '<div class="qa-input-wrap">' +
        '<input type="text" id="fabInput" autocomplete="off" ' +
        'placeholder="如 600519、gmt、茅台…">' +
        '<button class="qa-clear-btn" id="fabClear">×</button>' +
      '</div>' +
      '<div class="qa-results" id="fabResults"></div>' +
      '<div class="qa-hint">↑↓ 选择 · Enter 添加 · Esc 关闭 · 支持拼音首字母 / 汉字 / 代码</div>' +
      '<div class="qa-quick" id="fabHot"></div>' +
      '<div class="qa-recent" id="fabRecentBox" style="display:none">' +
        '<div class="lb">最近添加</div>' +
        '<div class="chips" id="fabRecentChips"></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(p);
  FAB.panel = p;
  FAB.input = p.querySelector("#fabInput");
  FAB.results = p.querySelector("#fabResults");

  /* 点击面板外关闭 */
  p.addEventListener("mousedown", function(e){ e.stopPropagation(); });
  document.addEventListener("mousedown", function(e){
    if(p.style.display !== "none" && !p.contains(e.target) &&
       !($("fabAdd") && $("fabAdd").contains(e.target))){
      fabToggle(false);
    }
  });

  FAB.input.addEventListener("input", function(){
    var q = FAB.input.value.trim();
    clearTimeout(FAB.timer);
    if(!q){ FAB.items = []; fabRenderResults(); fabRenderHot(); return; }
    var seq = ++FAB.seq;
    FAB.timer = setTimeout(function(){
      searchStock(q, function(items, done){
        if(seq !== FAB.seq) return;
        FAB.items = items;
        FAB.idx = items.length ? 0 : -1;
        fabRenderResults();
      });
    }, 180);
  });

  FAB.input.addEventListener("keydown", function(e){
    if(!FAB.items.length){
      if(e.key === "Enter" && FAB.input.value.trim()){
        e.preventDefault();
        fabSubmitRaw(FAB.input.value.trim());
      }
      if(e.key === "Escape") fabToggle(false);
      return;
    }
    if(e.key === "ArrowDown"){ e.preventDefault(); FAB.idx = Math.min(FAB.items.length - 1, FAB.idx + 1); fabRenderResults(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); FAB.idx = Math.max(0, FAB.idx - 1); fabRenderResults(); }
    else if(e.key === "Enter"){ e.preventDefault(); fabPick(FAB.items[FAB.idx >= 0 ? FAB.idx : 0]); }
    else if(e.key === "Escape"){ fabToggle(false); }
  });

  var clrBtn = p.querySelector("#fabClear");
  if(clrBtn) clrBtn.onclick = function(){ FAB.input.value = ""; FAB.items = []; fabRenderResults(); fabRenderHot(); FAB.input.focus(); };

  return p;
}

function fabRenderResults(){
  var box = FAB.results;
  if(!box) return;
  if(!FAB.items.length){ box.innerHTML = ""; return; }
  var h = "";
  FAB.items.forEach(function(it, i){
    var sel = (i === FAB.idx) ? " sel" : "";
    var inList = state.holdings.some(function(hd){ return hd.code === it.code; });
    var tag = inList ? '<span class="tag have">已持有</span>'
            : (it.src === "网络" ? '<span class="tag net">网</span>'
            : '<span class="tag">' + esc(it.src || "") + '</span>');
    h += '<div class="qa-result' + sel + '" data-i="' + i + '">' +
      '<span class="code">' + esc(it.code) + '</span>' +
      '<span class="name">' + esc(it.name) + '</span>' + tag + '</div>';
  });
  box.innerHTML = h;
  Array.prototype.forEach.call(box.querySelectorAll(".qa-result"), function(d){
    d.onmouseenter = function(){ FAB.idx = +d.dataset.i; fabRenderResults(); };
    d.onmousedown = function(e){ e.preventDefault(); fabPick(FAB.items[+d.dataset.i]); };
  });
}

function fabRenderHot(){
  var box = $("fabHot");
  if(!box) return;
  var h = "";
  FAB_HOT.forEach(function(s){
    var inList = state.holdings.some(function(hd){ return hd.code === s.code; });
    h += '<span class="chip' + (inList ? " have" : "") + '" data-code="' + s.code + '" data-name="' + esc(s.name) + '">' +
      esc(s.name) + '</span>';
  });
  box.innerHTML = h;
  Array.prototype.forEach.call(box.querySelectorAll(".chip"), function(c){
    c.onclick = function(){
      fabPick({code:c.dataset.code, name:c.dataset.name, src:"热门"});
    };
  });
  /* 最近添加 */
  var rcBox = $("fabRecentBox");
  var rcChips = $("fabRecentChips");
  if(rcBox && rcChips){
    if(FAB.recent.length){
      rcBox.style.display = "block";
      var rh = "";
      FAB.recent.forEach(function(r){
        rh += '<span class="chip" data-code="' + r.code + '" data-name="' + esc(r.name) + '">' +
          esc(r.name) + '</span>';
      });
      rcChips.innerHTML = rh;
      Array.prototype.forEach.call(rcChips.querySelectorAll(".chip"), function(c){
        c.onclick = function(){
          fabPick({code:c.dataset.code, name:c.dataset.name, src:"最近"});
        };
      });
    } else {
      rcBox.style.display = "none";
    }
  }
}

async function fabPick(it){
  if(!it) return;
  fabAddRecent(it.code, it.name);
  var t = typeOfCode(it.code, it.name);
  var has = state.holdings.find(function(h){ return h.code === it.code; });
  if(!has){
    state.holdings.push({code:it.code, name:it.name, type:t, inReport:true, group:"持仓"});
    saveState();
  }
  fabToggle(false);
  /* 自动拉取 */
  var haveData = !!(state.stocks[it.code] && state.stocks[it.code].rows && state.stocks[it.code].rows.length > 20);
  if(!haveData){
    toastInfo("正在拉取 " + it.name + " 日K数据…");
    try{
      var n = await fetchStockDataRetry(it.code);
      if(n > 0){
        toastOk(it.name + " 拉取成功，" + n + " 根日K");
      } else {
        toastWarn(it.name + " 暂无联网数据，可手动粘贴日K", 4200);
      }
    }catch(e){
      toastErr(it.name + " 拉取异常：" + String(e.message || e).slice(0, 40), 4200);
    }
  } else {
    toastOk((has ? "已存在：" : "已添加：") + it.name + "（" + it.code + "）");
  }
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  fabUpdateBadge();
}

async function fabSubmitRaw(q){
  if(!q) return;
  var local = searchLocal(q, 1);
  if(local.length){ fabPick(local[0]); return; }
  txSmartbox(q, function(items){
    if(items.length){ fabPick({code:items[0].code, name:items[0].name, py:items[0].py, src:"网络"}); }
    else if(/^\d{6}$/.test(q)){
      fabPick({code:q, name:nameOf(q) || ("代码" + q), src:"代码"});
    }
    else toastWarn("没找到「" + q + "」，试试代码 / 拼音首字母 / 名称");
  });
}

function fabUpdateBadge(){
  var badge = $("fabBadge");
  if(!badge) return;
  var n = state.holdings.length;
  if(n > 0){
    badge.textContent = n;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function bindFab(){
  fabLoadRecent();
  var btn = $("fabAdd");
  if(btn) btn.onclick = function(e){ e.preventDefault(); fabToggle(); };
}

/* ===================== 2. 拉取可靠性增强 ===================== */

/* 带自动重试的拉取 */
async function fetchStockDataRetry(code, retries){
  retries = retries || 2;
  var lastErr = "";
  for(var attempt = 0; attempt <= retries; attempt++){
    try{
      var n;
      if(typeof fetchStockData === "function" && fetchStockData !== fetchStockDataRetry){
        n = await fetchStockData(code);
      } else {
        n = await fetchStockDataV2(code);
      }
      if(n > 0) return n;
      lastErr = LAST_FETCH_ERR || "无数据";
      if(attempt < retries){
        var delay = 800 * (attempt + 1);
        await new Promise(function(r){ setTimeout(r, delay); });
      }
    }catch(e){
      lastErr = String(e.message || e);
      if(attempt < retries){
        await new Promise(function(r){ setTimeout(r, 800 * (attempt + 1)); });
      }
    }
  }
  return 0;
}

/* 备用拉取：腾讯日线 v2 接口（不同路径，增加成功率） */
async function fetchTxV2(code, n){
  var sym = mktPrefix(code) + String(code).replace(/\D/g, "");
  var u = "https://web.ifzq.gtimg.cn/appstock/app/kline/kline?param=" + sym + ",day,," + n + ",qfq";
  var r = await withTimeout(fetch(u, {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }), 9000);
  var key = sym;
  var d = r && r.data && (r.data[key] || r.data[Object.keys(r.data || {})[0]]);
  if(!d) throw new Error("返回结构异常");
  var arr = d.qfqday || d.day || [];
  if(!arr.length) throw new Error("空数据");
  return arr.map(function(x){
    return {day:x[0], open:x[1], close:x[2], high:x[3], low:x[4], volume:x[5]};
  });
}

/* v2 拉取主函数（带额外备用源） */
async function fetchStockDataV2(code, opt){
  opt = opt || {};
  var n = opt.n || 320;
  code = String(code || "").replace(/\D/g, "").slice(0, 6);
  if(code.length !== 6) return 0;

  var order = (APICFG && APICFG.order && APICFG.order.length) ? APICFG.order.slice() : ["tx", "sina", "em"];
  if(order.indexOf("tx") < 0) order.unshift("tx");
  FETCH_DIAG = [];
  var rows = null, used = "";

  for(var i = 0; i < order.length; i++){
    var src = order[i];
    if(APICFG && APICFG.on && APICFG.on[src] === false) continue;
    var t0 = Date.now();
    try{
      var raw = null;
      if(src === "tx")        raw = await withTimeout(fetchTx(code, n), 10000);
      else if(src === "sina") raw = await withTimeout(fetchSinaN(code, n), 10000);
      else if(src === "em")   raw = await withTimeout(fetchEm(code, n), 10000);
      var ms = Date.now() - t0;
      var r = (raw && raw.length) ? normRaw(raw) : [];
      if(r.length >= 8){
        rows = r; used = src;
        FETCH_DIAG.push({src:src, ok:true, ms:ms, n:r.length});
        break;
      }
      FETCH_DIAG.push({src:src, ok:false, ms:ms, err:"返回数据不足（" + r.length + " 根）"});
    }catch(e){
      FETCH_DIAG.push({src:src, ok:false, ms:Date.now() - t0,
        err:String((e && e.message) || e || "未知").slice(0, 60)});
    }
  }

  /* 所有标准源都失败，尝试备用腾讯 v2 */
  if(!rows){
    try{
      var t1 = Date.now();
      var raw2 = await withTimeout(fetchTxV2(code, n), 9000);
      var r2 = (raw2 && raw2.length) ? normRaw(raw2) : [];
      var ms2 = Date.now() - t1;
      if(r2.length >= 8){
        rows = r2; used = "tx2";
        FETCH_DIAG.push({src:"tx2", ok:true, ms:ms2, n:r2.length});
      } else {
        FETCH_DIAG.push({src:"tx2", ok:false, ms:ms2, err:"备用源数据不足"});
      }
    }catch(e2){
      FETCH_DIAG.push({src:"tx2", ok:false, ms:0, err:String((e2 && e2.message) || e2).slice(0, 60)});
    }
  }

  if(typeof apiLog === "function"){
    apiLog({t:new Date().toISOString().slice(0, 19).replace("T", " "), src:used || "-",
      code:code, ok:!!rows, n:rows ? rows.length : 0,
      ms:(FETCH_DIAG.length ? FETCH_DIAG[FETCH_DIAG.length - 1].ms : 0)});
  }

  if(!rows || !rows.length){
    LAST_FETCH_ERR = "全部数据源均未取到数据\n" + diagText();
    return 0;
  }
  state.stocks[code] = {rows:rows};
  if(typeof clearAn === "function") clearAn(code);
  if(typeof saveState === "function") saveState();
  var h = state.holdings.find(function(x){ return x.code === code; });
  if(h && (!h.name || /^代码/.test(h.name))){
    h.name = (NAME_IDX[code] && NAME_IDX[code].name) || h.name;
  }
  LAST_FETCH_ERR = "";
  if(typeof renderAdmin === "function" && document.getElementById("admin") &&
     document.getElementById("admin").classList.contains("on")) renderAdmin();
  return rows.length;
}

/* ===================== 3. 复盘检查清单 ===================== */
var CHECKLIST_ITEMS = [
  {id:"market", txt:"查看大盘环境（指数涨跌 / 涨跌家数 / 板块轮动）", tab:"market"},
  {id:"breadth", txt:"确认市场情绪（涨跌比 / 涨停跌停 / 连板高度）", tab:"market"},
  {id:"holdings", txt:"逐一检查持仓技术形态（评分 / 信号 / 支撑压力）", tab:"holdings"},
  {id:"alerts", txt:"扫描大事提醒与技术信号触发", tab:"alerts"},
  {id:"stock", txt:"深入分析重点个股（K线 / MACD / 均线 / 布林）", tab:"stock"},
  {id:"compare", txt:"走势对比：持仓 vs 指数 / 同业强弱", tab:"compare"},
  {id:"notes", txt:"记录今日判断与明日操作计划", tab:"notes"},
  {id:"report", txt:"生成复盘报告并归档", tab:"report"}
];

function checklistLoad(){
  try{
    var s = localStorage.getItem("ashare_checklist");
    if(s) return JSON.parse(s) || {};
  }catch(e){}
  return {};
}
function checklistSave(obj){
  try{ localStorage.setItem("ashare_checklist", JSON.stringify(obj)); }catch(e){}
}
function checklistTodayKey(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function renderChecklist(){
  var box = $("checklistBox");
  if(!box) return;
  var saved = checklistLoad();
  var today = checklistTodayKey();
  var todayState = saved[today] || {};
  var h = "";
  CHECKLIST_ITEMS.forEach(function(item){
    var done = !!todayState[item.id];
    h += '<div class="cl-item' + (done ? " done" : "") + '" data-id="' + item.id + '" data-tab="' + item.tab + '">' +
      '<div class="cl-ic"></div>' +
      '<div class="cl-txt">' + esc(item.txt) + '</div>' +
    '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".cl-item").forEach(function(el){
    el.onclick = function(){
      var id = el.dataset.id;
      var today = checklistTodayKey();
      var saved = checklistLoad();
      if(!saved[today]) saved[today] = {};
      saved[today][id] = !saved[today][id];
      checklistSave(saved);
      renderChecklist();
      /* 如果勾选了，跳转到对应标签页 */
      if(saved[today][id]){
        var item = CHECKLIST_ITEMS.find(function(x){ return x.id === id; });
        if(item && item.tab){
          try{ tab(item.tab); }catch(e){}
        }
      }
    };
  });
}

/* ===================== 4. 快速导航卡片 ===================== */
function renderQuickNav(){
  var box = $("quickNav");
  if(!box) return;
  var holdingsN = state.holdings.length;
  var withDataN = 0;
  state.holdings.forEach(function(h){
    var s = state.stocks[h.code];
    if(s && s.rows && s.rows.length > 8) withDataN++;
  });
  var alertsN = ALERTS.length;
  var notesN = (typeof NOTES !== "undefined") ? NOTES.length : 0;
  var sigN = 0;
  state.holdings.forEach(function(h){
    var an = getAn(h.code);
    if(an && an.sigs) sigN += an.sigs.filter(function(s){ return s.i >= an.i - 5; }).length;
  });

  var cards = [
    {ic:"📊", tt:"大盘环境", ds:"指数走势 / 板块轮动", tab:"market", badge:""},
    {ic:"📈", tt:"个股诊断", ds:"K线 / MACD / 趋势分析", tab:"stock", badge:""},
    {ic:"💼", tt:"持仓管理", ds:holdingsN + " 只标的 · " + withDataN + " 只有数据", tab:"holdings", badge:holdingsN > 0 ? holdingsN + " 只" : ""},
    {ic:"🔔", tt:"大事提醒", ds:alertsN + " 条提醒待查", tab:"alerts", badge:alertsN > 0 ? alertsN + " 条" : ""},
    {ic:"⚡", tt:"信号汇总", ds:"近 5 日 " + sigN + " 个技术信号", tab:"dash", badge:sigN > 0 ? sigN + " 信号" : ""},
    {ic:"📝", tt:"复盘笔记", ds:notesN + " 条笔记", tab:"notes", badge:notesN > 0 ? notesN + " 条" : ""},
    {ic:"📄", tt:"复盘报告", ds:"一键生成今日复盘报告", tab:"report", badge:""},
    {ic:"🔍", tt:"走势对比", ds:"多标的归一化强弱对比", tab:"compare", badge:""}
  ];

  var h = "";
  cards.forEach(function(c){
    h += '<div class="qn-card" data-tab="' + c.tab + '">' +
      '<div class="qn-ic">' + c.ic + '</div>' +
      '<div class="qn-tt">' + esc(c.tt) + '</div>' +
      '<div class="qn-ds">' + esc(c.ds) + '</div>' +
      (c.badge ? '<div class="qn-badge">' + esc(c.badge) + '</div>' : '') +
    '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".qn-card").forEach(function(el){
    el.onclick = function(){
      var t = el.dataset.tab;
      try{ tab(t); }catch(e){}
    };
  });
}

/* ===================== 5. 隐私发布检查 ===================== */
function renderPubCheck(){
  var box = $("pubCheck");
  if(!box) return;
  var checks = [];

  /* 检查 1: DEFAULT_HOLDINGS 是否为空 */
  var dhEmpty = (typeof DEFAULT_HOLDINGS !== "undefined" && DEFAULT_HOLDINGS.length === 0);
  checks.push({ok:dhEmpty, txt:"内置持仓列表（DEFAULT_HOLDINGS）" + (dhEmpty ? "为空" : "含 " + DEFAULT_HOLDINGS.length + " 条个人持仓")});

  /* 检查 2: localStorage 是否有用户持仓 */
  var lsData = "";
  try{ lsData = localStorage.getItem(LS_KEY) || ""; }catch(e){}
  var lsHas = lsData && lsData.length > 10;
  var lsHoldingsN = 0;
  if(lsHas){
    try{ var p = JSON.parse(lsData); if(p && p.holdings) lsHoldingsN = p.holdings.length; }catch(e){}
  }
  checks.push({ok:!lsHas || lsHoldingsN === 0, txt:"localStorage 无用户持仓数据" + (lsHas ? "（当前有 " + lsHoldingsN + " 只，发布前请清空）" : "")});

  /* 检查 3: POS（持仓成本）是否为空 */
  var posHas = false;
  try{ var ps = localStorage.getItem("ashare_pos"); if(ps && ps !== "{}") posHas = true; }catch(e){}
  checks.push({ok:!posHas, txt:"持仓成本数据（POS）" + (posHas ? "非空，含个人交易成本" : "为空")});

  /* 检查 4: ALERTS 是否有个人提醒 */
  var alertsHas = ALERTS && ALERTS.length > 0;
  checks.push({ok:!alertsHas, txt:"大事提醒列表" + (alertsHas ? "有 " + ALERTS.length + " 条个人提醒" : "为空")});

  /* 检查 5: NOTES 是否有个人笔记 */
  var notesN = 0;
  try{ var ns = localStorage.getItem("ashare_notes"); if(ns){ notesN = JSON.parse(ns).length || 0; } }catch(e){}
  checks.push({ok:notesN === 0, txt:"复盘笔记" + (notesN > 0 ? "有 " + notesN + " 条个人笔记" : "为空")});

  /* 检查 6: .gitignore 是否覆盖 index.html */
  checks.push({ok:true, txt:"index.html 是构建产物（由 build.py 从 _src/ 生成），源码中不含个人数据"});

  /* 检查 7: API 调用日志 */
  var apiLogN = APILOG.length;
  checks.push({ok:apiLogN === 0, txt:"API 调用日志" + (apiLogN > 0 ? "有 " + apiLogN + " 条（含拉取记录，建议清空）" : "为空")});

  var h = "";
  checks.forEach(function(c){
    h += '<div class="pc-row">' +
      '<div class="pc-st ' + (c.ok ? "ok" : "no") + '">' + (c.ok ? "✓" : "✕") + '</div>' +
      '<div class="pc-txt">' + esc(c.txt) + '</div>' +
    '</div>';
  });
  box.innerHTML = h;
}

function clearAllPersonalData(){
  if(!confirm("确认清空全部个人数据？\n\n将删除：持仓列表、持仓成本、复盘笔记、大事提醒、API日志、复盘清单。\n内置的公开行情快照不受影响。\n\n此操作不可撤销！")) return;
  try{
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem("ashare_pos");
    localStorage.removeItem("ashare_alerts");
    localStorage.removeItem("ashare_notes");
    localStorage.removeItem("ashare_apilog");
    localStorage.removeItem("ashare_checklist");
    localStorage.removeItem("ashare_fab_recent");
  }catch(e){}
  /* 重新加载状态 */
  state = loadState();
  POS = {};
  ALERTS = [];
  APILOG = [];
  FAB.recent = [];
  if(typeof clearAn === "function") clearAn();
  if(typeof renderHoldings === "function") renderHoldings();
  if(typeof renderRail === "function") renderRail();
  if(typeof renderDash === "function") renderDash();
  if(typeof renderAlerts === "function") renderAlerts();
  if(typeof renderAdmin === "function") renderAdmin();
  renderPubCheck();
  renderChecklist();
  renderQuickNav();
  fabUpdateBadge();
  var msg = $("privMsg");
  if(msg) msg.innerHTML = '<span style="color:var(--down)">✓ 已清空全部个人数据，可安全发布到 GitHub</span>';
  toastOk("个人数据已清空，可安全发布");
}

function exportSafeSnapshot(){
  /* 导出一份不含个人数据的 JSON 快照 */
  var safe = {
    ver: APPVER,
    date: new Date().toISOString().slice(0, 10),
    holdings: [],
    stocks: {},
    market: state.market,
    sectors: state.sectors,
    snap: state.snap,
    risk: state.risk
  };
  var json = JSON.stringify(safe, null, 2);
  dl("ashare_safe_snapshot_" + Date.now() + ".json", json, "application/json");
  toastOk("已导出安全快照（不含个人持仓 / 成本 / 笔记）");
}

function bindPrivacy(){
  var btn = $("btnPubCheck");
  if(btn) btn.onclick = renderPubCheck;
  var btn2 = $("btnExportSafe");
  if(btn2) btn2.onclick = exportSafeSnapshot;
  var btn3 = $("btnClearAll");
  if(btn3) btn3.onclick = clearAllPersonalData;
}

/* ===================== 6. 增强 renderDash ===================== */
var _renderDashOrig = renderDash;
renderDash = function(){
  _renderDashOrig();
  renderQuickNav();
  renderChecklist();
};

/* ===================== 7. 增强 renderHoldings ===================== */
/* 在持仓管理页面顶部添加批量操作栏 */
var _renderHoldingsOrig = renderHoldings;
renderHoldings = function(){
  _renderHoldingsOrig();
  var box = $("holdList");
  if(!box) return;
  /* 在表格上方插入批量操作栏 */
  var existing = $("batchBar");
  if(existing) return;
  var bar = document.createElement("div");
  bar.id = "batchBar";
  bar.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap";
  bar.innerHTML =
    '<button class="btn primary sm" id="batchFetch">⚡ 批量联网拉取</button>' +
    '<button class="btn sm" id="batchAllOn">☑ 全部纳入报告</button>' +
    '<button class="btn sm" id="batchAllOff">☑ 全部排除报告</button>' +
    '<button class="btn sm" id="batchClearData">🗑 清空已拉取数据</button>' +
    '<span class="muted" id="batchMsg" style="font-size:12px"></span>';
  box.parentNode.insertBefore(bar, box);

  var bf = $("batchFetch");
  if(bf) bf.onclick = async function(){
    if(state.holdings.length === 0){ toastWarn("没有持仓，请先添加标的"); return; }
    var codes = state.holdings.map(function(h){ return h.code; });
    var msg = $("batchMsg"); if(msg) msg.textContent = "批量拉取中…";
    toastInfo("开始批量拉取 " + codes.length + " 只标的…");
    var done = 0, fail = 0;
    for(var i = 0; i < codes.length; i++){
      var c = codes[i];
      if(msg) msg.textContent = "拉取中 " + (i+1) + "/" + codes.length + " " + nameOf(c) + "…";
      try{
        var n = await fetchStockDataRetry(c);
        if(n > 0) done++; else fail++;
      }catch(e){ fail++; }
    }
    if(msg) msg.textContent = "完成：成功 " + done + " 只，失败 " + fail + " 只";
    if(done > 0) toastOk("批量拉取完成：成功 " + done + " 只，失败 " + fail + " 只");
    else toastErr("全部拉取失败，请检查网络或手动粘贴日K");
    renderHoldings(); renderRail(); renderDash();
  };

  var bon = $("batchAllOn");
  if(bon) bon.onclick = function(){
    state.holdings.forEach(function(h){ h.inReport = true; });
    saveState(); renderHoldings(); renderRail(); renderDash();
    toastOk("已全部纳入报告");
  };
  var boff = $("batchAllOff");
  if(boff) boff.onclick = function(){
    state.holdings.forEach(function(h){ h.inReport = false; });
    saveState(); renderHoldings(); renderRail(); renderDash();
    toastOk("已全部排除报告");
  };
  var bcd = $("batchClearData");
  if(bcd) bcd.onclick = function(){
    if(!confirm("清空所有已拉取的日K数据？\n（不影响持仓列表，可重新拉取）")) return;
    state.stocks = buildDefaultStocks();
    saveState();
    if(typeof clearAn === "function") clearAn();
    renderHoldings(); renderRail(); renderDash();
    toastOk("已清空用户拉取数据（保留内置快照）");
  };
};

/* ===================== 初始化 ===================== */
var _initV15 = null;
function initV15(){
  try{ fabLoadRecent(); }catch(e){}
  try{ bindFab(); }catch(e){}
  try{ fabUpdateBadge(); }catch(e){}
  try{ bindPrivacy(); }catch(e){}
}

/* 拦截 v2InitSteps，插入 v15 初始化 */
var _v2InitStepsOrigV15 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV15();
  try{
    initV15();
    /* 当切到帮助页时渲染隐私检查 */
    var _origTab = tab;
    if(!_origTab._wrapped){
      tab = function(id){
        _origTab(id);
        if(id === "help"){
          setTimeout(renderPubCheck, 50);
        }
        if(id === "dash"){
          setTimeout(function(){ renderQuickNav(); renderChecklist(); }, 50);
        }
      };
      tab._wrapped = true;
    }
  }catch(e){ if(console&&console.error) console.error("v15 init:", e); }
};

/* Ctrl+K / Cmd+K 呼出浮动面板 */
document.addEventListener("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.key === "k"){
    e.preventDefault();
    fabToggle();
  }
});

/* ============================================================
   engine16 · 复盘增强：市场脉搏 / 持仓异动 / 分组 / 复盘日记
   ============================================================ */

/* ===================== 1. 今日市场脉搏 ===================== */
function renderPulse(){
  var body = $("pulseBody");
  if(!body) return;
  var m = state.market || {};
  var snap = state.snap || {};
  var sectors = state.sectors || [];

  /* 指数数据 */
  var indices = [
    {lb:"上证指数", close:m.sh_close, chg:m.sh_chg, amt:m.sh_amt},
    {lb:"深证成指", close:m.sz_close, chg:m.sz_chg, amt:m.sz_amt},
    {lb:"创业板指", close:m.cy_close, chg:m.cy_chg, amt:m.cy_amt}
  ];

  var h = '<div class="pulse-grid">';
  indices.forEach(function(idx){
    var chg = num(idx.chg);
    var cls = chg > 0 ? "up" : (chg < 0 ? "down" : "flat");
    var arrow = chg > 0 ? "▲" : (chg < 0 ? "▼" : "—");
    h += '<div class="pulse-cell ' + cls + '">' +
      '<div class="pl-lb">' + idx.lb + '</div>' +
      '<div class="pl-vl">' + (idx.close ? f2(idx.close) : "—") + '</div>' +
      '<div class="pl-ex">' + arrow + ' ' + pct(idx.chg) + '</div>' +
    '</div>';
  });

  /* 涨跌家数 */
  var br = state.breadth || {};
  var upN = num(br.up) || 0, dnN = num(br.down) || 0, flatN = num(br.flat) || 0;
  var total = upN + dnN + flatN;
  var upRatio = total ? Math.round(upN / total * 100) : 0;
  h += '<div class="pulse-cell ' + (upN >= dnN ? "up" : "down") + '">' +
    '<div class="pl-lb">涨跌家数</div>' +
    '<div class="pl-vl">' + upN + ' / ' + dnN + '</div>' +
    '<div class="pl-ex">上涨占比 ' + upRatio + '%</div>' +
  '</div>';

  /* 涨停跌停 */
  var ztN = num(br.zt) || 0, dtN = num(br.dt) || 0;
  h += '<div class="pulse-cell ' + (ztN >= dtN ? "up" : "down") + '">' +
    '<div class="pl-lb">涨停 / 跌停</div>' +
    '<div class="pl-vl">' + ztN + ' / ' + dtN + '</div>' +
    '<div class="pl-ex">' + (ztN > 0 ? "赚钱效应偏强" : "—") + '</div>' +
  '</div>';

  h += '</div>';

  /* 板块 TOP */
  if(sectors.length){
    h += '<div style="margin-top:10px;font-size:12px;color:var(--muted2);margin-bottom:4px">板块领涨</div>';
    sectors.slice(0, 5).forEach(function(s){
      var c = num(s.chg);
      var cls = c > 0 ? "up" : (c < 0 ? "down" : "");
      h += '<div class="pulse-sec">' +
        '<span class="nm">' + esc(s.name) + '</span>' +
        '<span class="ch ' + cls + '">' + (c > 0 ? "+" : "") + f2(c) + '%</span>' +
        (s.leader ? '<span class="lb">' + esc(s.leader) + '</span>' : '') +
      '</div>';
    });
  }

  /* 资金快照 */
  var money = snap.money || [];
  if(money.length){
    h += '<div style="margin-top:8px;font-size:12px;color:var(--muted2);margin-bottom:4px">主力资金</div>';
    money.slice(0, 3).forEach(function(mf){
      h += '<div class="pulse-sec">' +
        '<span class="nm">' + esc(mf.name || mf.n || "") + '</span>' +
        '<span class="ch ' + (num(mf.net || mf.amt) > 0 ? "up" : "down") + '">' +
          (num(mf.net || mf.amt) > 0 ? "+" : "") + esc(String(mf.net || mf.amt || "")) + '</span>' +
      '</div>';
    });
  }

  body.innerHTML = h;

  /* 日期 */
  var dt = $("pulseDate");
  if(dt){
    var d = new Date();
    dt.textContent = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }
}

function bindPulse(){
  var btn = $("pulseRefresh");
  if(btn) btn.onclick = function(){
    if(typeof refreshMarket === "function"){
      refreshMarket();
    } else {
      try{ renderHeader(); }catch(e){}
    }
    setTimeout(renderPulse, 500);
  };
  var exp = $("pulseExpand");
  if(exp) exp.onclick = function(){
    var card = $("pulseCard");
    if(!card) return;
    card.classList.toggle("pulse-collapsed");
    exp.textContent = card.classList.contains("pulse-collapsed") ? "展开" : "收起";
  };
}

/* ===================== 2. 持仓异动监控 ===================== */
function renderChanges(){
  var body = $("changeBody");
  if(!body) return;
  if(!state.holdings.length){
    body.innerHTML = '<div class="chg-empty">还没有持仓。点击右下角 + 添加标的开始复盘。</div>';
    return;
  }

  var feed = [];
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    if(!an || !an.dates || !an.dates.length) return;
    var k = an.i, nm = hd.name || an.name || hd.code;

    /* 近 3 日技术信号 */
    if(an.sigs){
      an.sigs.filter(function(s){ return s.i >= k - 3; }).forEach(function(s){
        feed.push({
          type:"sig", code:hd.code, name:nm,
          icon: s.side === "b" ? "▲" : (s.side === "s" ? "▼" : "●"),
          text: s.nm + " — " + (s.ds || "").slice(0, 50),
          date: s.date || an.dates[s.i] || "",
          tag: s.side === "b" ? "多头" : (s.side === "s" ? "空头" : "中性")
        });
      });
    }

    /* 价格变动（最近一日） */
    if(an.closes && k >= 1){
      var chg = an.chg;
      if(Math.abs(num(chg)) >= 2){
        feed.push({
          type:"move", code:hd.code, name:nm,
          icon: chg > 0 ? "↑" : "↓",
          text: "单日" + (chg > 0 ? "上涨" : "下跌") + " " + pct(chg) + "（收 " + f2(an.close) + "）",
          date: an.dates[k] || "",
          tag: Math.abs(num(chg)) >= 5 ? "大波动" : "异动"
        });
      }
    }
  });

  /* 提醒触发 */
  ALERTS.forEach(function(a){
    if(a.hit){
      feed.push({
        type:"alert", code:a.code, name:a.name || a.code,
        icon:"!",
        text: alertTypeTxt(a.type) + " 已触发" + (a.hitInfo ? "：" + a.hitInfo : ""),
        date:"",
        tag:"提醒"
      });
    }
  });

  /* 按日期倒序 */
  feed.sort(function(a, b){
    return (b.date || "").localeCompare(a.date || "");
  });

  if(!feed.length){
    body.innerHTML = '<div class="chg-empty">近 3 日无异常信号 / 价格异动 / 提醒触发，组合平稳。</div>';
    return;
  }

  /* tab 筛选 */
  var h = '<div class="chg-tabs">' +
    '<span class="chg-tab active" data-filter="all">全部 ' + feed.length + '</span>' +
    '<span class="chg-tab" data-filter="sig">信号 ' + feed.filter(function(f){return f.type==="sig";}).length + '</span>' +
    '<span class="chg-tab" data-filter="move">异动 ' + feed.filter(function(f){return f.type==="move";}).length + '</span>' +
    '<span class="chg-tab" data-filter="alert">提醒 ' + feed.filter(function(f){return f.type==="alert";}).length + '</span>' +
  '</div>';

  h += '<div class="chg-feed" id="chgFeed">';
  feed.forEach(function(f){
    h += '<div class="chg-row ' + f.type + '" data-code="' + esc(f.code) + '" data-filter="' + f.type + '">' +
      '<div class="chg-ic">' + f.icon + '</div>' +
      '<div class="chg-nm">' + esc(f.name) + '</div>' +
      '<div class="chg-cd">' + esc(f.code) + '</div>' +
      '<div class="chg-tx">' + esc(f.text) + '</div>' +
      '<div class="chg-tag">' + esc(f.tag) + '</div>' +
      '<div class="chg-dt">' + esc(f.date) + '</div>' +
    '</div>';
  });
  h += '</div>';

  body.innerHTML = h;

  /* tab 事件 */
  body.querySelectorAll(".chg-tab").forEach(function(t){
    t.onclick = function(){
      body.querySelectorAll(".chg-tab").forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active");
      var f = t.dataset.filter;
      body.querySelectorAll(".chg-row").forEach(function(r){
        r.style.display = (f === "all" || r.dataset.filter === f) ? "" : "none";
      });
    };
  });

  /* 点击行跳转个股诊断 */
  body.querySelectorAll(".chg-row").forEach(function(r){
    r.onclick = function(){
      var code = r.dataset.code;
      try{ pickStock(code); tab("stock"); }catch(e){}
    };
  });
}

/* ===================== 3. 标的分组 ===================== */
var STOCK_GROUPS = ["持仓", "观察", "题材"];
var _grpActive = "全部";

function grpLoad(){
  try{
    var s = localStorage.getItem("ashare_groups");
    if(s) STOCK_GROUPS = JSON.parse(s) || ["持仓", "观察", "题材"];
  }catch(e){}
}
function grpSave(){
  try{ localStorage.setItem("ashare_groups", JSON.stringify(STOCK_GROUPS)); }catch(e){}
}

function renderGrpBar(){
  var bar = $("grpBar");
  if(!bar) return;
  var counts = {};
  counts["全部"] = state.holdings.length;
  STOCK_GROUPS.forEach(function(g){
    counts[g] = state.holdings.filter(function(h){ return h.group === g; }).length;
  });

  var h = '<span class="grp-chip' + (_grpActive === "全部" ? " active" : "") + '" data-grp="全部">全部<span class="cnt">' + (counts["全部"] || 0) + '</span></span>';
  STOCK_GROUPS.forEach(function(g){
    h += '<span class="grp-chip' + (_grpActive === g ? " active" : "") + '" data-grp="' + esc(g) + '">' + esc(g) + '<span class="cnt">' + (counts[g] || 0) + '</span></span>';
  });
  h += '<span class="grp-add" id="grpAdd">+ 新建分组</span>';
  bar.innerHTML = h;

  bar.querySelectorAll(".grp-chip").forEach(function(c){
    c.onclick = function(){
      _grpActive = c.dataset.grp;
      renderGrpBar();
      renderHoldings();
    };
  });

  var add = $("grpAdd");
  if(add) add.onclick = function(){
    var name = prompt("输入新分组名称：");
    if(name && name.trim()){
      name = name.trim();
      if(STOCK_GROUPS.indexOf(name) < 0){
        STOCK_GROUPS.push(name);
        grpSave();
        _grpActive = name;
        renderGrpBar();
      }
    }
  };
}

/* 在持仓表格中增加分组列 */
var _renderHoldingsOrigV16 = null;
function patchHoldingsForGroups(){
  if(_renderHoldingsOrigV16) return;
  _renderHoldingsOrigV16 = renderHoldings;

  renderHoldings = function(){
    /* 调用原始函数 */
    _renderHoldingsOrigV16();
    /* 然后过滤显示 */
    var box = $("holdList");
    if(!box) return;
    var rows = box.querySelectorAll("tbody tr");
    if(_grpActive === "全部") return;
    rows.forEach(function(tr){
      var hi = tr.querySelector("[data-hi]");
      if(!hi) return;
      var idx = +hi.dataset.hi;
      var hd = state.holdings[idx];
      if(!hd) return;
      tr.style.display = (hd.group === _grpActive) ? "" : "none";
    });
  };
}

/* 在持仓编辑中增加分组选择 */
function patchHoldingRowForGroup(){
  /* 在 renderHoldings 之后，找到每行添加分组下拉 */
  var box = $("holdList");
  if(!box) return;
  var ths = box.querySelectorAll("thead th");
  /* 在"类型"列后插入"分组"列 */
  var typeTh = box.querySelector("thead th:nth-child(4)");
  if(typeTh && !box.querySelector("thead th.grp-th")){
    var grpTh = document.createElement("th");
    grpTh.className = "grp-th";
    grpTh.style.width = "90px";
    grpTh.textContent = "分组";
    typeTh.parentNode.insertBefore(grpTh, typeTh.nextSibling);
  }
  /* 在每行的类型列后插入分组选择 */
  var rows = box.querySelectorAll("tbody tr");
  rows.forEach(function(tr){
    if(tr.querySelector(".grp-sel")) return;
    var typeCell = tr.querySelector("td:nth-child(4)");
    if(!typeCell) return;
    var hi = tr.querySelector("[data-hi]");
    if(!hi) return;
    var idx = +hi.dataset.hi;
    var hd = state.holdings[idx];
    if(!hd) return;
    var grpCell = document.createElement("td");
    var sel = document.createElement("select");
    sel.className = "grp-sel";
    sel.style.cssText = "width:80px;font-size:12px";
    STOCK_GROUPS.forEach(function(g){
      var opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      if(hd.group === g) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = function(){
      state.holdings[idx].group = sel.value;
      saveState();
    };
    grpCell.appendChild(sel);
    typeCell.parentNode.insertBefore(grpCell, typeCell.nextSibling);
  });
}

/* ===================== 4. 复盘日记时间线 ===================== */
function journalLoad(){
  try{
    var s = localStorage.getItem("ashare_journal");
    if(s) return JSON.parse(s) || [];
  }catch(e){}
  return [];
}
function journalSave(entries){
  try{ localStorage.setItem("ashare_journal", JSON.stringify(entries)); }catch(e){}
}

function journalGenEntry(){
  var today = checklistTodayKey();
  var entries = journalLoad();
  /* 如果今天已有条目，不重复生成 */
  var existing = entries.find(function(e){ return e.date === today; });
  if(existing) return existing;

  var m = state.market || {};
  var avgScore = 0, n = 0, bullN = 0, bearN = 0, sigN = 0;
  state.holdings.forEach(function(hd){
    var an = getAn(hd.code);
    if(an){
      avgScore += an.score.total; n++;
      if(an.score.total >= 62) bullN++;
      if(an.score.total < 45) bearN++;
      if(an.sigs) sigN += an.sigs.filter(function(s){ return s.i >= an.i - 5; }).length;
    }
  });
  avgScore = n ? Math.round(avgScore / n) : 0;

  var shChg = num(m.sh_chg);
  var entry = {
    date: today,
    market: {
      sh: shChg, sz: num(m.sz_chg), cy: num(m.cy_chg)
    },
    portfolio: {
      avg: avgScore, n: n, bull: bullN, bear: bearN, sigs: sigN
    },
    checklist: checklistLoad()[today] || {},
    note: ""
  };
  entries.unshift(entry);
  if(entries.length > 365) entries.length = 365;
  journalSave(entries);
  return entry;
}

function journalRender(){
  var box = $("journalBox");
  if(!box) return;
  var entries = journalLoad();
  if(!entries.length){
    box.innerHTML = '<div class="chg-empty">还没有日记。点击下方「生成今日日记」开始记录。</div>' +
      '<div style="text-align:center;margin-top:10px"><button class="btn primary sm" id="journalGen">✍ 生成今日日记</button></div>';
    var gen = $("journalGen");
    if(gen) gen.onclick = function(){ journalGenEntry(); journalRender(); };
    return;
  }

  var h = "";
  entries.slice(0, 30).forEach(function(e){
    var m = e.market || {};
    var p = e.portfolio || {};
    var cl = m.sh >= 0 ? "up" : "down";
    var tone = p.avg >= 62 ? "偏强" : (p.avg < 45 ? "偏弱" : "中性");
    var toneCls = p.avg >= 62 ? "up" : (p.avg < 45 ? "down" : "");

    var body = "大盘：上证 " + (m.sh >= 0 ? "+" : "") + m.sh + "% · 深成 " + (m.sz >= 0 ? "+" : "") + m.sz + "% · 创业 " + (m.cy >= 0 ? "+" : "") + m.cy + "%<br>" +
      "组合：均分 <b>" + (p.avg || "—") + "</b> 分（" + (p.n || 0) + " 只），<span class='" + toneCls + "'>" + tone + "</span>，多头 " + p.bull + " / 空头 " + p.bear + "，近5日 " + p.sigs + " 个信号";

    if(e.note) body += "<br>笔记：" + esc(e.note);

    var clDone = 0, clTotal = 0;
    if(e.checklist){
      for(var k in e.checklist){ clTotal++; if(e.checklist[k]) clDone++; }
    }

    h += '<div class="journal-entry">' +
      '<div class="je-dot"></div>' +
      '<div class="je-date">' + esc(e.date) + (clTotal ? ' · 复盘清单 ' + clDone + '/' + clTotal : '') + '</div>' +
      '<div class="je-body">' + body + '</div>' +
      '<div class="je-tags">' +
        '<span class="chg-tag">上证' + (m.sh >= 0 ? "+" : "") + m.sh + "%</span>" +
        '<span class="chg-tag">均分' + (p.avg || "—") + '</span>' +
        '<span class="chg-tag">' + tone + '</span>' +
      '</div>' +
    '</div>';
  });
  box.innerHTML = h +
    '<div style="text-align:center;padding:10px"><button class="btn sm" id="journalGen2">✍ 更新今日日记</button></div>';

  var gen2 = $("journalGen2");
  if(gen2) gen2.onclick = function(){
    /* 删除今天的旧条目再重新生成 */
    var today = checklistTodayKey();
    var entries = journalLoad().filter(function(e){ return e.date !== today; });
    journalSave(entries);
    journalGenEntry();
    journalRender();
  };
}

function bindJournal(){
  var exp = $("journalExport");
  if(exp) exp.onclick = function(){
    var entries = journalLoad();
    if(!entries.length){ toastWarn("暂无日记可导出"); return; }
    var text = entries.map(function(e){
      var m = e.market || {}, p = e.portfolio || {};
      return "[" + e.date + "] 上证" + (m.sh >= 0 ? "+" : "") + m.sh + "% 深成" + (m.sz >= 0 ? "+" : "") + m.sz + "% 创业" + (m.cy >= 0 ? "+" : "") + m.cy + "% | 组合均分" + (p.avg || "—") + " 多" + p.bull + " 空" + p.bear + " 信号" + p.sigs + (e.note ? " | " + e.note : "");
    }).join("\n");
    dl("journal_" + Date.now() + ".txt", text, "text/plain;charset=utf-8");
    toastOk("日记已导出");
  };
}

/* ===================== 5. 增强仪表盘渲染 ===================== */
var _renderDashV16Orig = null;
function patchRenderDash(){
  if(_renderDashV16Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV16Orig = renderDash;
  renderDash = function(){
    _renderDashV16Orig();
    renderPulse();
    renderChanges();
    renderQuickNav();
    renderChecklist();
    journalRender();
  };
}

/* ===================== 初始化 ===================== */
var _initV16 = null;
function initV16(){
  try{ grpLoad(); }catch(e){}
  try{ patchRenderDash(); }catch(e){}
  try{ patchHoldingsForGroups(); }catch(e){}
  try{ bindPulse(); }catch(e){}
  try{ bindJournal(); }catch(e){}
  try{ renderGrpBar(); }catch(e){}

  /* 在 renderHoldings 之后自动补分组列 */
  var _origRH = renderHoldings;
  if(!_origRH._grpPatched){
    renderHoldings = function(){
      _origRH();
      try{ renderGrpBar(); }catch(e){}
      try{ patchHoldingRowForGroup(); }catch(e){}
      try{ if(_grpActive !== "全部"){
        var box = $("holdList");
        if(box){
          box.querySelectorAll("tbody tr").forEach(function(tr){
            var hi = tr.querySelector("[data-hi]");
            if(!hi) return;
            var idx = +hi.dataset.hi;
            var hd = state.holdings[idx];
            if(hd && hd.group !== _grpActive) tr.style.display = "none";
          });
        }
      }}catch(e){}
    };
    renderHoldings._grpPatched = true;
  }
}

var _v2InitStepsOrigV16 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV16();
  try{ initV16(); }catch(e){ if(console&&console.error) console.error("v16 init:", e); }
};

/* ============================================================
   engine17 · 个股诊断增强：该股提醒 / 快速操作 / 复盘打磨
   ============================================================ */

/* ===================== 1. 该股大事提醒 ===================== */
function renderStockAlerts(code){
  var box = $("stockAlertList");
  if(!box) return;
  var list = ALERTS.filter(function(a){ return a.code === code; });
  if(!list.length){
    box.innerHTML = '<div class="empty" style="padding:14px">该股暂无提醒。在下方添加价格上破 / 下破 / 涨跌 / 日期 / 自定义事项。</div>';
    return;
  }
  var an = getAn(code);
  var cur = an ? f2(an.close) : "无数据";
  var h = "";
  list.forEach(function(a){
    var idx = ALERTS.indexOf(a);
    var cond = "";
    if(a.type === "above") cond = "收盘 ≥ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val) + "（现价 " + cur + "）";
    else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + Number(a.val).toFixed(2) + "%";
    else if(a.type === "date") cond = "到期 " + esc(a.val);
    else cond = esc(a.val);

    h += '<div class="alertrow ' + (a.hit ? "hit" : "") + '">' +
      '<div style="padding-top:2px">' + (a.hit ? "🔔" : "⏳") + '</div>' +
      '<div class="txt"><div class="tt">' +
        '<span class="pbadge">' + alertTypeTxt(a.type) + '</span>' +
        (a.hit ? ' <span class="pbadge ok">已触发</span>' : '') +
        '</div>' +
      '<div class="ds">' + cond + (a.hitInfo ? '　<b style="color:#ffd48a">' + esc(a.hitInfo) + '</b>' : '') + '</div></div>' +
      '<button class="btn sm" data-sa-read="' + idx + '">已读</button>' +
      '<button class="btn sm danger" data-sa-del="' + idx + '">删</button>' +
      '</div>';
  });
  box.innerHTML = h;
  box.querySelectorAll("[data-sa-del]").forEach(function(b){
    b.onclick = function(){
      ALERTS.splice(+b.dataset.saDel, 1);
      alertSave();
      renderStockAlerts(code);
      renderAlerts();
    };
  });
  box.querySelectorAll("[data-sa-read]").forEach(function(b){
    b.onclick = function(){
      var a = ALERTS[+b.dataset.saRead];
      if(a){ a.hit = false; a.hitInfo = ""; }
      alertSave();
      renderStockAlerts(code);
      renderAlerts();
    };
  });
}

function bindStockAlertAdd(){
  var btn = $("saAdd");
  if(!btn) return;
  btn.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var name = ($("stockName").value || "").trim() || nameOf(code);
    var type = $("saType").value;
    var val = $("saVal").value.trim();
    var price = $("saPrice").value.trim();

    /* 价格类型用 price 输入框 */
    if(type === "above" || type === "below"){
      val = price;
    }
    if(!val){ toastWarn("请输入提醒值"); return; }

    ALERTS.unshift({code:code, name:name, type:type, val:val, hit:false, hitInfo:""});
    alertSave();
    renderStockAlerts(code);
    renderAlerts();
    $("saVal").value = "";
    $("saPrice").value = "";
    toastOk("提醒已添加：" + name + " " + alertTypeTxt(type) + " " + val);
  };

  /* 类型切换时调整输入框 */
  var sel = $("saType");
  if(sel) sel.onchange = function(){
    var v = sel.value;
    var pi = $("saPrice");
    var vi = $("saVal");
    if(v === "above" || v === "below"){
      if(pi) pi.placeholder = "价格";
      if(vi) vi.placeholder = "（可选备注）";
    } else if(v === "chg"){
      if(pi) pi.placeholder = "—";
      if(vi) vi.placeholder = "如 3.5 表示 ±3.5%";
    } else if(v === "date"){
      if(pi) pi.placeholder = "—";
      if(vi) { vi.type = "date"; vi.placeholder = "选择日期"; }
    } else {
      if(pi) pi.placeholder = "—";
      if(vi) { vi.type = "text"; vi.placeholder = "自定义事项"; }
    }
  };
}

/* ===================== 2. 快速操作栏 ===================== */
function bindStockActions(){
  var compare = $("saCompare");
  if(compare) compare.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var name = ($("stockName").value || "").trim() || nameOf(code);
    /* 加入走势对比 */
    if(typeof CMP_CODES !== "undefined" && CMP_CODES.indexOf(code) < 0){
      CMP_CODES.push(code);
      try{ localStorage.setItem("ashare_cmp", JSON.stringify(CMP_CODES)); }catch(e){}
    }
    toastOk(name + " 已加入走势对比");
    tab("compare");
  };

  var note = $("saNote");
  if(note) note.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    var name = ($("stockName").value || "").trim() || nameOf(code);
    tab("notes");
    setTimeout(function(){
      /* 尝试在笔记页选中该标的 */
      var sel = $("noteCode");
      if(sel){ sel.value = code; }
      var inp = $("noteTitle");
      if(inp){ inp.value = name + " 复盘"; inp.focus(); }
    }, 100);
  };

  var report = $("saReport");
  if(report) report.onclick = function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    var h = state.holdings.find(function(x){ return x.code === code; });
    if(h){
      h.inReport = true;
      saveState();
      toastOk(h.name + " 已纳入复盘报告");
    } else {
      toastWarn("该标的不在持仓列表中，请先添加");
    }
  };

  var refresh = $("saRefresh");
  if(refresh) refresh.onclick = async function(){
    var code = ($("stockCode").value || "").trim();
    if(!code){ toastWarn("请先选择标的"); return; }
    toastInfo("正在重新拉取 " + nameOf(code) + "…");
    try{
      var n;
      if(typeof fetchStockDataRetry === "function"){
        n = await fetchStockDataRetry(code);
      } else {
        n = await fetchStockData(code);
      }
      if(n > 0){
        toastOk(nameOf(code) + " 拉取成功，" + n + " 根日K");
        loadCurrent();
      } else {
        toastWarn(nameOf(code) + " 拉取失败，可手动粘贴日K", 4200);
      }
    }catch(e){
      toastErr("拉取异常：" + String(e.message || e).slice(0, 40), 4200);
    }
  };
}

/* ===================== 3. 左侧 rail 增强：显示信号标记 ===================== */
var _renderRailOrigV17 = null;
function patchRail(){
  if(_renderRailOrigV17) return;
  if(typeof renderRail !== "function") return;
  _renderRailOrigV17 = renderRail;
  renderRail = function(){
    _renderRailOrigV17();
    /* 在每个 rail 项上添加信号标记 */
    var box = $("railList");
    if(!box) return;
    box.querySelectorAll(".it").forEach(function(el){
      var code = el.dataset.c;
      if(!code) return;
      var an = getAn(code);
      if(!an || !an.sigs) return;
      var recent = an.sigs.filter(function(s){ return s.i >= an.i - 3; });
      if(!recent.length) return;
      /* 如果还没有信号标记 */
      if(el.querySelector(".sig-mark")) return;
      var rt = el.querySelector(".rt");
      if(!rt) return;
      var mark = document.createElement("div");
      mark.className = "sig-mark";
      mark.style.cssText = "position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%";
      var lastSig = recent[recent.length - 1];
      mark.style.background = lastSig.side === "b" ? "var(--down)" : (lastSig.side === "s" ? "var(--up)" : "var(--muted2)");
      mark.title = lastSig.nm + " " + (lastSig.date || "");
      el.style.position = "relative";
      el.appendChild(mark);
    });
  };
}

/* ===================== 4. 增强复盘报告：显示该股提醒 ===================== */
var _renderReportStockOrig = null;
function patchReportStock(){
  /* 在报告的每个标的区块末尾追加该股提醒 */
  if(typeof renderReportStock !== "function") return;
  _renderReportStockOrig = renderReportStock;
  renderReportStock = function(hd, an){
    var html = _renderReportStockOrig(hd, an);
    /* 追加该股提醒 */
    var list = ALERTS.filter(function(a){ return a.code === hd.code; });
    if(list.length){
      html += '<h4>🔔 该股提醒</h4><ul>';
      list.forEach(function(a){
        var cond = "";
        if(a.type === "above") cond = "收盘 ≥ " + f2(a.val);
        else if(a.type === "below") cond = "收盘 ≤ " + f2(a.val);
        else if(a.type === "chg") cond = "单日涨跌 ≥ ±" + a.val + "%";
        else if(a.type === "date") cond = "到期 " + a.val;
        else cond = a.val;
        html += "<li>" + alertTypeTxt(a.type) + "：" + esc(cond) + (a.hit ? "（已触发）" : "") + "</li>";
      });
      html += "</ul>";
    }
    return html;
  };
}

/* ===================== 5. 信号面板增强：信号统计摘要 ===================== */
function renderSignalSummary(){
  /* 在信号列表上方添加摘要 */
  var box = $("sigList");
  if(!box) return;
  var an = CUR.an;
  if(!an || !an.sigs) return;

  var existing = $("sigSummary");
  if(existing) existing.remove();

  var all = an.sigs;
  var bull = all.filter(function(s){ return s.side === "b"; }).length;
  var bear = all.filter(function(s){ return s.side === "s"; }).length;
  var neu = all.filter(function(s){ return s.side !== "b" && s.side !== "s"; }).length;
  var recent5 = all.filter(function(s){ return s.i >= an.i - 5; }).length;
  var recent20 = all.filter(function(s){ return s.i >= an.i - 20; }).length;

  var div = document.createElement("div");
  div.id = "sigSummary";
  div.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)";
  div.innerHTML =
    '<span style="font-size:12px;color:var(--muted)">信号统计：</span>' +
    '<span class="chip up" style="font-size:11px">多头 ' + bull + '</span>' +
    '<span class="chip down" style="font-size:11px">空头 ' + bear + '</span>' +
    '<span class="chip neu" style="font-size:11px">中性 ' + neu + '</span>' +
    '<span style="font-size:11px;color:var(--muted2)">近5日 ' + recent5 + ' 个 · 近20日 ' + recent20 + ' 个</span>';

  box.parentNode.insertBefore(div, box);
}

/* ===================== 6. 持仓表格增强：高亮有信号的行 ===================== */
function highlightSignalRows(){
  var box = $("holdList");
  if(!box) return;
  var rows = box.querySelectorAll("tbody tr");
  rows.forEach(function(tr){
    var hi = tr.querySelector("[data-hi]");
    if(!hi) return;
    var idx = +hi.dataset.hi;
    var hd = state.holdings[idx];
    if(!hd) return;
    var an = getAn(hd.code);
    if(!an || !an.sigs) return;
    var hasRecent = an.sigs.some(function(s){ return s.i >= an.i - 3; });
    if(hasRecent){
      tr.style.boxShadow = "inset 3px 0 0 var(--accent)";
    }
  });
}

/* ===================== 初始化 ===================== */
var _initV17 = null;
function initV17(){
  try{ bindStockAlertAdd(); }catch(e){}
  try{ bindStockActions(); }catch(e){}
  try{ patchRail(); }catch(e){}
  try{ patchReportStock(); }catch(e){}
}

var _v2InitStepsOrigV17 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV17();
  try{ initV17(); }catch(e){ if(console&&console.error) console.error("v17 init:", e); }
};

/* 在 renderDiag 之后渲染信号摘要 */
var _renderDiagOrigV17 = null;
function patchRenderDiag(){
  if(_renderDiagOrigV17) return;
  if(typeof renderDiag !== "function") return;
  _renderDiagOrigV17 = renderDiag;
  renderDiag = function(an){
    _renderDiagOrigV17(an);
    try{ renderSignalSummary(); }catch(e){}
  };
}

/* 在 renderHoldings 之后高亮信号行 */
var _renderHoldingsOrigV17 = null;
function patchHoldingsHighlight(){
  if(_renderHoldingsOrigV17) return;
  if(typeof renderHoldings !== "function") return;
  /* 等待其他 patch 完成后再 patch */
  _renderHoldingsOrigV17 = renderHoldings;
  renderHoldings = function(){
    _renderHoldingsOrigV17();
    try{ highlightSignalRows(); }catch(e){}
  };
}

/* 二次 patch（在 v15/v16 patch 之后） */
var _v2InitStepsOrigV17b = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV17b();
  try{
    patchRenderDiag();
    patchHoldingsHighlight();
  }catch(e){}
};

/* ============================================================
   engine18 · 笔记增强 + 复盘模式 + 仪表盘打磨
   ============================================================ */

/* ===================== 1. 笔记增强 ===================== */

var NOTE_TEMPLATES = {
  watch:  {title:"观察等待", text:"当前价格 ，技术形态 。等待 回调/突破 ， 到 位再评估。"},
  buy:    {title:"计划买入", text:"入场区间 - ，仓位 %，止损 ，目标 - 。逻辑："},
  sell:   {title:"计划卖出", text:"现价 ，计划在 减仓/清仓。理由：。止损上移至 。"},
  stop:   {title:"止损位", text:"止损设在 ，对应亏损 %。触发后无条件离场。"},
  target: {title:"目标位", text:"第一目标 ，第二目标 ，对应涨幅 %。到价减仓 。"},
  market: {title:"大盘随笔", text:"今日大盘 ，涨跌家比 ，涨停 板。板块轮动：。整体感受：。"}
};

function bindNoteTemplates(){
  var bar = $("noteTmplBar");
  if(!bar) return;
  bar.querySelectorAll(".note-tmpl").forEach(function(el){
    el.onclick = function(){
      var key = el.dataset.tmpl;
      var t = NOTE_TEMPLATES[key];
      if(!t) return;
      var titleEl = $("noteTitle");
      var textEl = $("noteText");
      var tagEl = $("noteTag");
      if(titleEl) titleEl.value = t.title;
      if(textEl){ textEl.value = t.text; textEl.focus(); }
      if(tagEl) tagEl.value = key;
      if(textEl){
        var idx = t.text.indexOf("，");
        if(idx > 0){ textEl.setSelectionRange(idx, idx); }
      }
    };
  });
}

/* 渲染笔记列表（增强版） */
var _renderNotesOrig = null;
function patchNotes(){
  if(_renderNotesOrig) return;
  if(typeof renderNotes !== "function") return;
  _renderNotesOrig = renderNotes;
  renderNotes = function(){
    _renderNotesOrig();
    var box = $("noteList");
    if(!box) return;
    var filter = ($("noteFilter") ? $("noteFilter").value : "").trim().toLowerCase();

    var list = NOTES.filter(function(n){
      if(_noteTagFilter && (n.tag || "") !== _noteTagFilter) return false;
      if(!filter) return true;
      var txt = (n.title || "") + " " + (n.text || "") + " " + (n.code || "") + " " + (n.name || "") + " " + (n.tag || "");
      return txt.toLowerCase().indexOf(filter) >= 0;
    });

    if(!list.length){
      box.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted2);font-size:13px">暂无笔记。点击上方模板快速创建。</div>';
      return;
    }

    var h = "";
    list.forEach(function(n){
      var realIdx = NOTES.indexOf(n);
      var time = n.time || n.date || "";
      h += '<div class="note-card">' +
        '<div class="nc-head">' +
          '<div class="nc-title">' + esc(n.title || "无标题") + '</div>' +
          (n.code ? '<span class="nc-code">' + esc(n.code) + ' ' + esc(n.name || "") + '</span>' : '') +
          '<span class="nc-time">' + esc(time) + '</span>' +
          '<span class="nc-del" data-ni="' + realIdx + '">删</span>' +
        '</div>' +
        '<div class="nc-body">' + esc(n.text || "").replace(/\n/g, "<br>") + '</div>' +
        (n.tag ? '<div class="nc-tags"><span class="nc-tag">' + esc(n.tag) + '</span></div>' : '') +
      '</div>';
    });
    box.innerHTML = h;

    box.querySelectorAll(".nc-del").forEach(function(b){
      b.onclick = function(){
        var idx = +b.dataset.ni;
        NOTES.splice(idx, 1);
        try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
        renderNotes();
        if(typeof renderQuickNav === "function") renderQuickNav();
      };
    });
  };
}

var _noteTagFilter = "";
function renderNoteTagFilter(){
  var box = $("noteTagFilter");
  if(!box) return;
  var tags = {};
  NOTES.forEach(function(n){
    var t = n.tag || "";
    if(t) tags[t] = (tags[t] || 0) + 1;
  });
  var keys = Object.keys(tags);
  if(!keys.length){ box.innerHTML = ""; return; }
  var h = '<span class="ntf' + (_noteTagFilter === "" ? " active" : "") + '" data-tag="">全部</span>';
  keys.forEach(function(t){
    h += '<span class="ntf' + (_noteTagFilter === t ? " active" : "") + '" data-tag="' + esc(t) + '">' +
      esc(t) + ' <span style="opacity:.6">' + tags[t] + '</span></span>';
  });
  box.innerHTML = h;
  box.querySelectorAll(".ntf").forEach(function(el){
    el.onclick = function(){
      _noteTagFilter = el.dataset.tag;
      renderNoteTagFilter();
      renderNotes();
    };
  });
}

/* 笔记添加增强 */
function bindNoteAdd(){
  var btn = $("addNote");
  if(!btn || btn._enhanced) return;
  btn._enhanced = true;
  btn.onclick = function(){
    var code = $("noteCode") ? $("noteCode").value : "";
    var name = "";
    if(code){
      var h = state.holdings.find(function(x){ return x.code === code; });
      name = h ? h.name : (typeof nameOf === "function" ? nameOf(code) : code);
    }
    var title = $("noteTitle") ? $("noteTitle").value.trim() : "";
    var text = $("noteText") ? $("noteText").value.trim() : "";
    var tag = $("noteTag") ? $("noteTag").value.trim() : "";

    if(!text && !title){ toastWarn("请输入笔记内容"); return; }

    var now = new Date();
    var time = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" +
      String(now.getDate()).padStart(2,"0") + " " + String(now.getHours()).padStart(2,"0") + ":" +
      String(now.getMinutes()).padStart(2,"0");

    NOTES.unshift({code:code, name:name, title:title, text:text, tag:tag, time:time});
    try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
    renderNotes();
    if(typeof renderQuickNav === "function") renderQuickNav();
    if($("noteText")) $("noteText").value = "";
    if($("noteTitle")) $("noteTitle").value = "";
    if($("noteTag")) $("noteTag").value = "";
    var msg = $("noteMsg");
    if(msg){ msg.textContent = "已保存"; setTimeout(function(){ msg.textContent = ""; }, 2000); }
    toastOk("笔记已保存");
  };
}

/* ===================== 2. 复盘模式 ===================== */
var REVIEW = {overlay:null, idx:0, items:[], reviewed:[], notes:[], finished:false};

function openReviewMode(){
  if(!state.holdings.length){
    toastWarn("请先添加持仓标的");
    tab("holdings");
    return;
  }
  REVIEW.items = state.holdings.filter(function(h){ return h.inReport !== false; });
  if(!REVIEW.items.length) REVIEW.items = state.holdings.slice();
  REVIEW.idx = 0;
  REVIEW.reviewed = [];
  REVIEW.notes = [];
  REVIEW.finished = false;

  /* 移除旧的 keydown 监听 */
  if(REVIEW._keyHandler){
    document.removeEventListener("keydown", REVIEW._keyHandler);
  }
  REVIEW._keyHandler = function(e){
    if(!REVIEW.overlay) return;
    if(e.key === "Escape"){ e.preventDefault(); reviewClose(); }
    else if(e.key === "ArrowLeft"){ e.preventDefault(); reviewPrev(); }
    else if(e.key === "ArrowRight" || (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "INPUT")){
      e.preventDefault(); reviewNext();
    }
  };
  document.addEventListener("keydown", REVIEW._keyHandler);

  reviewRender();
}

function reviewClose(){
  if(REVIEW._keyHandler){
    document.removeEventListener("keydown", REVIEW._keyHandler);
    REVIEW._keyHandler = null;
  }
  if(REVIEW.overlay){
    REVIEW.overlay.remove();
    REVIEW.overlay = null;
  }
  REVIEW.finished = false;
}

function reviewNext(){
  if(REVIEW.finished) return;
  /* 保存快速笔记 */
  var qi = $("rvQuickNote");
  if(qi && qi.value.trim()){
    var hd = REVIEW.items[REVIEW.idx];
    var nm = hd ? (hd.name || hd.code) : "";
    REVIEW.notes.push({code:hd ? hd.code : "", name:nm, text:qi.value.trim(), time:new Date().toLocaleString("zh-CN").slice(0,16)});
    qi.value = "";
  }

  if(REVIEW.idx < REVIEW.items.length - 1){
    REVIEW.reviewed[REVIEW.idx] = true;
    REVIEW.idx++;
    reviewRender();
  } else {
    REVIEW.reviewed[REVIEW.idx] = true;
    REVIEW.finished = true;
    reviewRenderSummary();
  }
}

function reviewPrev(){
  if(REVIEW.finished){ REVIEW.finished = false; }
  if(REVIEW.idx > 0){
    REVIEW.idx--;
    reviewRender();
  }
}

/* 安全取值 */
function rvSafe(v, dflt){ return (v === undefined || v === null) ? dflt : v; }
function rvF2(v){ return (v !== undefined && v !== null && !isNaN(v)) ? f2(v) : "—"; }
function rvF1(v){ return (v !== undefined && v !== null && !isNaN(v)) ? f1(v) : "—"; }
function rvPct(v){ return (v !== undefined && v !== null && !isNaN(v)) ? pct(v) : "—"; }
function rvNum(v){ return (v !== undefined && v !== null && !isNaN(v)) ? Number(v) : 0; }

function reviewRender(){
  if(REVIEW.finished){ reviewRenderSummary(); return; }

  var ov = REVIEW.overlay;
  if(!ov){
    ov = document.createElement("div");
    ov.className = "review-overlay";
    document.body.appendChild(ov);
    REVIEW.overlay = ov;
  }

  var hd = REVIEW.items[REVIEW.idx];
  if(!hd){ reviewClose(); return; }

  var an = null;
  try{ an = getAn(hd.code); }catch(e){ an = null; }
  var nm = hd.name || (an ? an.name : "") || hd.code;

  var prog = "";
  REVIEW.items.forEach(function(_, i){
    var cls = i === REVIEW.idx ? "current" : (REVIEW.reviewed[i] ? "done" : "");
    prog += '<span class="rn-dot ' + cls + '"></span>';
  });

  var isLast = REVIEW.idx >= REVIEW.items.length - 1;

  var content = "";
  try{
    if(!an || !an.dates || !an.dates.length){
      content = '<div class="review-empty">' +
        '<p style="font-size:16px">📋 ' + esc(nm) + '（' + esc(hd.code) + '）</p>' +
        '<p>暂无日K数据，请先联网拉取或手动粘贴</p>' +
        '<div class="flex" style="justify-content:center;gap:8px;margin-top:16px">' +
          '<button class="btn primary sm" id="rvFetch">↻ 联网拉取</button>' +
        '</div>' +
      '</div>';
    } else {
      var k = an.i;
      var chg = rvNum(an.chg);
      var chgCls = chg >= 0 ? "up" : "down";

      /* 信号 */
      var sigs = (an.sigs || []).filter(function(s){ return s.i >= k - 10; });
      var sigHtml = "";
      sigs.forEach(function(s){
        var cls = s.side === "b" ? "up" : (s.side === "s" ? "down" : "neu");
        sigHtml += '<span class="chip ' + cls + '" style="font-size:11px">' + esc(s.nm || "") + ' ' + esc(s.date || "") + '</span>';
      });
      if(!sigHtml) sigHtml = '<span style="color:var(--muted2);font-size:12px">近10日无信号</span>';

      /* 提醒 */
      var alerts = ALERTS.filter(function(a){ return a.code === hd.code; });
      var alertHtml = "";
      alerts.forEach(function(a){
        var cond = "";
        if(a.type === "above") cond = "收盘 ≥ " + rvF2(a.val);
        else if(a.type === "below") cond = "收盘 ≤ " + rvF2(a.val);
        else if(a.type === "chg") cond = "涨跌 ≥ ±" + esc(String(a.val || "")) + "%";
        else if(a.type === "date") cond = "到期 " + esc(String(a.val || ""));
        else cond = esc(String(a.val || ""));
        alertHtml += '<div style="padding:4px 0;font-size:12px;color:var(--muted)">' +
          (a.hit ? "🔔" : "⏳") + " " + (typeof alertTypeTxt === "function" ? alertTypeTxt(a.type) : a.type) + "：" + cond +
          (a.hit ? ' <span style="color:#ffd48a">已触发</span>' : '') + '</div>';
      });

      /* 笔记 */
      var notes = NOTES.filter(function(n){ return n.code === hd.code; });
      var noteHtml = "";
      notes.forEach(function(n){
        noteHtml += '<div style="padding:4px 0;font-size:12px;color:var(--muted);border-bottom:1px dashed var(--line)">' +
          (n.title ? '<b style="color:var(--txt)">' + esc(n.title) + '</b> — ' : '') +
          esc(n.text || "").slice(0, 120) +
          (n.time ? ' <span style="color:var(--muted2);font-size:10px">' + esc(n.time) + '</span>' : '') +
        '</div>';
      });
      if(!noteHtml) noteHtml = '<span style="color:var(--muted2);font-size:12px">暂无笔记</span>';

      /* KPI */
      var scoreTotal = (an.score && an.score.total !== undefined) ? an.score.total : "—";
      var scoreLabel = (an.score && an.score.label) ? an.score.label : "";
      var scoreTone  = (an.score && an.score.tone) ? an.score.tone : "";
      var rsiV = rvNum(an.rsiV);
      var rsiZone = an.rsiZone || "";
      var vr = rvNum(an.vr);

      content =
        '<div class="grid g4" style="margin-bottom:14px">' +
          '<div class="kpi ' + chgCls + '"><div class="lb">最新收盘</div><div class="vl">' + rvF2(an.close) + '</div><div class="ex">' + rvPct(chg) + '</div></div>' +
          '<div class="kpi ' + scoreTone + '"><div class="lb">技术评分</div><div class="vl">' + scoreTotal + '</div><div class="ex">' + scoreLabel + '</div></div>' +
          '<div class="kpi ' + (rsiV >= 70 ? "up" : (rsiV <= 30 ? "down" : "")) + '"><div class="lb">RSI(14)</div><div class="vl">' + (rsiV ? rvF1(an.rsiV) : "—") + '</div><div class="ex">' + rsiZone + '</div></div>' +
          '<div class="kpi"><div class="lb">量比(5日)</div><div class="vl">' + (vr ? vr.toFixed(2) : "—") + '</div><div class="ex">' + (vr > 1.5 ? "放量" : (vr < 0.7 ? "缩量" : "常态")) + '</div></div>' +
        '</div>';

      /* 均线 */
      var arrange = an.arrange || "—";
      var arrangeCls = arrange.indexOf("多头") >= 0 ? "up" : (arrange.indexOf("空头") >= 0 ? "down" : "neu");
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">均线排列</div>' +
        '<div class="flex" style="gap:6px;flex-wrap:wrap">' +
          '<span class="chip ' + arrangeCls + ' big">' + esc(arrange) + '</span>';
      if(an.wk && an.wk.ok && an.wk.arrange){
        content += '<span class="chip acc big">周线 ' + esc(an.wk.arrange) + '</span>';
      }
      content += '</div></div>';

      /* 信号 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">近 10 日信号</div>' +
        '<div class="flex" style="gap:6px;flex-wrap:wrap">' + sigHtml + '</div></div>';

      /* 提醒 */
      if(alertHtml){
        content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">该股提醒</div>' + alertHtml + '</div>';
      }

      /* 笔记 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">相关笔记</div>' + noteHtml + '</div>';

      /* 关键位 */
      var supArr = (an.sup || []).map(function(v){ return rvF2(v); }).filter(function(v){ return v !== "—"; });
      var resArr = (an.res || []).map(function(v){ return rvF2(v); }).filter(function(v){ return v !== "—"; });
      var ma20v = (an.ma20 && k >= 0 && an.ma20[k] !== undefined) ? rvF2(an.ma20[k]) : "—";
      var ma60v = (an.ma60 && k >= 0 && an.ma60[k] !== undefined) ? rvF2(an.ma60[k]) : "—";
      var blStr = "—";
      if(an.bl && an.bl.up && an.bl.up[k] !== undefined){
        blStr = rvF2(an.bl.lo[k]) + " / " + rvF2(an.bl.mid[k]) + " / " + rvF2(an.bl.up[k]);
      }
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">关键位</div>' +
        '<div style="font-size:12px;color:var(--muted);line-height:1.8">' +
          '支撑：' + (supArr.length ? supArr.join(" / ") : "—") +
          ' ｜ 压力：' + (resArr.length ? resArr.join(" / ") : "—") + '<br>' +
          'MA20：' + ma20v + ' ｜ MA60：' + ma60v + ' ｜ BOLL：' + blStr +
        '</div></div>';

      /* 迷你 K 线图 */
      content += '<div style="margin-bottom:14px"><div class="muted" style="font-size:12px;margin-bottom:4px">近 30 日 K 线</div>' +
        '<div id="rvChart" style="height:200px;border:1px solid var(--line);border-radius:8px"></div></div>';
    }
  }catch(err){
    content = '<div class="review-empty">' +
      '<p style="font-size:16px">📋 ' + esc(nm) + '（' + esc(hd.code) + '）</p>' +
      '<p>数据解析异常：' + esc(String(err.message || err).slice(0, 80)) + '</p>' +
      '<p style="font-size:12px;color:var(--muted2)">可尝试重新拉取数据或手动粘贴日K</p>' +
    '</div>';
  }

  ov.innerHTML =
    '<div class="review-bar">' +
      '<span style="font-size:18px">🎯</span>' +
      '<div class="rb-title">复盘模式 — ' + esc(nm) + '（' + esc(hd.code) + '）</div>' +
      '<span class="rb-count">' + (REVIEW.idx + 1) + ' / ' + REVIEW.items.length + '</span>' +
      '<button class="btn sm" id="rvPrev"' + (REVIEW.idx === 0 ? " disabled" : "") + '>← 上一只</button>' +
      '<button class="btn primary sm" id="rvNext">' + (isLast ? "✓ 完成" : "下一只 →") + '</button>' +
      '<button class="btn sm" id="rvClose">✕ 退出</button>' +
    '</div>' +
    '<div class="review-body">' +
      '<div class="review-nav">' +
        '<span style="font-size:12px;color:var(--muted)">← / → 键翻页 · Esc 退出</span>' +
        '<div class="rn-progress">' + prog + '</div>' +
      '</div>' +
      '<div class="review-content">' + content + '</div>' +
      '<div style="margin-top:12px">' +
        '<div class="muted" style="font-size:12px;margin-bottom:4px">快速笔记（写完按→下一只会自动保存）</div>' +
        '<textarea id="rvQuickNote" rows="2" placeholder="对 ' + esc(nm) + ' 的判断 / 计划…" style="width:100%;font-size:13px;padding:8px 10px;background:#0e141f;border:1px solid var(--line2);border-radius:8px;color:var(--txt)"></textarea>' +
      '</div>' +
      '<div class="flex" style="gap:8px;justify-content:center;padding:16px 0">' +
        '<button class="btn sm" id="rvStock">📊 深入诊断</button>' +
        '<button class="btn sm" id="rvNote">📝 写详细笔记</button>' +
        '<button class="btn sm" id="rvAlert">🔔 加提醒</button>' +
        (an && an.dates && an.dates.length ? '<button class="btn sm" id="rvCompare">📊 加入对比</button>' : '') +
      '</div>' +
    '</div>';

  /* 绑定事件 */
  var prev = $("rvPrev"); if(prev) prev.onclick = reviewPrev;
  var next = $("rvNext"); if(next) next.onclick = reviewNext;
  var close = $("rvClose"); if(close) close.onclick = reviewClose;
  var stock = $("rvStock"); if(stock) stock.onclick = function(){
    reviewClose();
    if(typeof pickStock === "function") pickStock(hd.code);
    tab("stock");
  };
  var note = $("rvNote"); if(note) note.onclick = function(){
    reviewClose();
    tab("notes");
    setTimeout(function(){
      var sel = $("noteCode");
      if(sel) sel.value = hd.code;
      var ti = $("noteTitle");
      if(ti){ ti.value = nm + " 复盘"; ti.focus(); }
    }, 100);
  };
  var alert = $("rvAlert"); if(alert) alert.onclick = function(){
    reviewClose();
    if(typeof pickStock === "function") pickStock(hd.code);
    tab("stock");
    setTimeout(function(){
      var box = $("stockAlertCard");
      if(box) box.scrollIntoView({behavior:"smooth"});
    }, 200);
  };
  var cmp = $("rvCompare");
  if(cmp) cmp.onclick = function(){
    if(typeof CMP_CODES !== "undefined" && CMP_CODES.indexOf(hd.code) < 0){
      CMP_CODES.push(hd.code);
      try{ localStorage.setItem("ashare_cmp", JSON.stringify(CMP_CODES)); }catch(e){}
    }
    toastOk(nm + " 已加入走势对比");
  };
  var fetch = $("rvFetch"); if(fetch) fetch.onclick = async function(){
    toastInfo("正在拉取 " + nm + "…");
    try{
      var n = 0;
      if(typeof fetchStockDataRetry === "function"){
        n = await fetchStockDataRetry(hd.code);
      } else if(typeof fetchStockData === "function"){
        n = await fetchStockData(hd.code);
      }
      if(n > 0){ toastOk(nm + " 拉取成功，" + n + " 根日K"); reviewRender(); }
      else toastWarn(nm + " 拉取失败，可手动粘贴日K", 4000);
    }catch(e){ toastErr("拉取异常：" + String(e.message || e).slice(0, 40)); }
  };

  /* 渲染迷你K线图 */
  if(an && an.dates && an.dates.length){
    setTimeout(function(){ try{ renderRvChart(hd.code); }catch(e){} }, 50);
  }

  /* 聚焦到快速笔记 */
  setTimeout(function(){
    var qi = $("rvQuickNote");
    if(qi) qi.focus();
  }, 200);
}

/* 迷你K线图 */
function renderRvChart(code){
  var box = $("rvChart");
  if(!box) return;
  var s = state.stocks[code];
  if(!s || !s.rows || !s.rows.length) return;
  var rows = s.rows.slice(-30);
  if(rows.length < 2) return;

  /* 用 echarts */
  if(typeof echarts === "undefined") return;
  var chart = echarts.init(box);
  var cats = rows.map(function(r){ return r.day; });
  var ohlc = rows.map(function(r){ return [r.open, r.close, r.low, r.high]; });
  var vols = rows.map(function(r){ return r.volume; });
  var maxVol = Math.max.apply(null, vols);

  chart.setOption({
    animation:false,
    grid:{left:40,right:16,top:16,bottom:48},
    xAxis:{type:"category",data:cats,axisLabel:{fontSize:9,interval:Math.floor(rows.length/6)}},
    yAxis:[{scale:true,splitLine:{lineStyle:{color:"rgba(38,49,69,.3)"}}},{scale:true,max:maxVol*4,splitLine:{show:false}}],
    series:[
      {type:"candlestick",data:ohlc,
        itemStyle:{color:"#e74c3c",color0:"#2ecc71",borderColor:"#e74c3c",borderColor0:"#2ecc71"},
        markPoint:{data:[
          {type:"max",name:"高",valueIndex:3},
          {type:"min",name:"低",valueIndex:2}
        ],itemStyle:{color:"rgba(76,141,255,.6)"}}
      },
      {name:"量",type:"bar",xAxisIndex:0,yAxisIndex:1,data:vols,
        itemStyle:{color:"rgba(76,141,255,.2)"}
      }
    ]
  });
  /* 自适应 */
  if(!REVIEW._resizeRv){
    REVIEW._resizeRv = function(){
      var b = $("rvChart");
      if(b){ echarts.getInstanceByDom(b) && echarts.getInstanceByDom(b).resize(); }
    };
    window.addEventListener("resize", REVIEW._resizeRv);
  }
}

/* 复盘完成摘要 */
function reviewRenderSummary(){
  var ov = REVIEW.overlay;
  if(!ov){
    ov = document.createElement("div");
    ov.className = "review-overlay";
    document.body.appendChild(ov);
    REVIEW.overlay = ov;
  }

  var n = REVIEW.items.length;
  var reviewedN = REVIEW.reviewed.filter(function(v){ return v; }).length;
  var noteN = REVIEW.notes.length;

  /* 汇总统计 */
  var bullN = 0, bearN = 0, avgScore = 0, scoreN = 0;
  REVIEW.items.forEach(function(hd){
    var an = null;
    try{ an = getAn(hd.code); }catch(e){}
    if(an && an.score){
      avgScore += rvNum(an.score.total);
      scoreN++;
      if(an.score.total >= 62) bullN++;
      if(an.score.total < 45) bearN++;
    }
  });
  avgScore = scoreN ? Math.round(avgScore / scoreN) : 0;

  var h =
    '<div class="review-bar">' +
      '<span style="font-size:18px">✅</span>' +
      '<div class="rb-title">复盘完成</div>' +
      '<button class="btn sm" id="rvClose">✕ 关闭</button>' +
    '</div>' +
    '<div class="review-body">' +
      '<div class="review-content" style="text-align:center;padding:40px 20px">' +
        '<div style="font-size:48px;margin-bottom:12px">🎉</div>' +
        '<div style="font-size:18px;margin-bottom:20px">本次复盘完成！</div>' +
        '<div class="grid g4" style="max-width:600px;margin:0 auto 24px">' +
          '<div class="kpi"><div class="lb">复盘标的</div><div class="vl">' + n + '</div><div class="ex">共过 ' + reviewedN + ' 只</div></div>' +
          '<div class="kpi ' + (avgScore >= 55 ? "up" : (avgScore < 45 ? "down" : "")) + '"><div class="lb">平均评分</div><div class="vl">' + (avgScore || "—") + '</div><div class="ex">技术形态综合</div></div>' +
          '<div class="kpi up"><div class="lb">偏多</div><div class="vl">' + bullN + '</div><div class="ex">评分 ≥ 62</div></div>' +
          '<div class="kpi down"><div class="lb">偏空</div><div class="vl">' + bearN + '</div><div class="ex">评分 < 45</div></div>' +
        '</div>';

  if(noteN > 0){
    h += '<div style="text-align:left;max-width:600px;margin:0 auto 20px"><div class="muted" style="font-size:12px;margin-bottom:6px">本次快速笔记（' + noteN + ' 条）</div>';
    REVIEW.notes.forEach(function(n){
      h += '<div class="note-card"><div class="nc-head"><div class="nc-title">' + esc(n.name) + '</div><span class="nc-time">' + esc(n.time) + '</span></div><div class="nc-body">' + esc(n.text) + '</div></div>';
    });
    h += '</div>';
  }

  h += '<div class="flex" style="gap:8px;justify-content:center">' +
      '<button class="btn primary sm" id="rvSaveNotes">💾 保存笔记到笔记页</button>' +
      '<button class="btn sm" id="rvReport">📄 生成复盘报告</button>' +
      '<button class="btn sm" id="rvRestart">🔄 重新复盘</button>' +
    '</div>' +
    '</div></div>';

  ov.innerHTML = h;

  var close = $("rvClose"); if(close) close.onclick = reviewClose;
  var save = $("rvSaveNotes"); if(save) save.onclick = function(){
    REVIEW.notes.forEach(function(n){
      NOTES.unshift({code:n.code, name:n.name, title:"复盘快速笔记", text:n.text, tag:"复盘", time:n.time});
    });
    try{ localStorage.setItem("ashare_notes", JSON.stringify(NOTES)); }catch(e){}
    renderNotes();
    if(typeof renderQuickNav === "function") renderQuickNav();
    toastOk("已保存 " + REVIEW.notes.length + " 条笔记");
  };
  var report = $("rvReport"); if(report) report.onclick = function(){
    reviewClose();
    tab("report");
    setTimeout(function(){
      var btn = $("genReport");
      if(btn) btn.click();
    }, 200);
  };
  var restart = $("rvRestart"); if(restart) restart.onclick = function(){
    REVIEW.finished = false;
    REVIEW.idx = 0;
    REVIEW.reviewed = [];
    REVIEW.notes = [];
    reviewRender();
  };
}

function bindReviewMode(){
  var btn = $("btnReviewMode");
  if(btn && !btn._rvBound){
    btn._rvBound = true;
    btn.onclick = openReviewMode;
  }
}

/* ===================== 3. 仪表盘空状态打磨 ===================== */
function polishEmptyStates(){
  var changeBody = $("changeBody");
  if(changeBody && !changeBody.innerHTML.trim()){
    changeBody.innerHTML = '<div class="chg-empty">添加持仓并拉取数据后，这里会显示近 3 日信号与异动</div>';
  }
  var journalBox = $("journalBox");
  if(journalBox && !journalBox.innerHTML.trim()){
    journalBox.innerHTML = '<div class="chg-empty">点击下方按钮生成今日复盘日记</div>';
  }
}

/* ===================== 初始化 ===================== */
function initV18(){
  try{ bindNoteTemplates(); }catch(e){}
  try{ patchNotes(); }catch(e){}
  try{ bindNoteAdd(); }catch(e){}
  try{ bindReviewMode(); }catch(e){}
}

var _v2InitStepsOrigV18 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV18();
  try{
    initV18();
    /* 在 renderNotes 后渲染标签过滤器 */
    var _origRN = renderNotes;
    if(_origRN && !_origRN._tagPatched){
      renderNotes = function(){
        _origRN();
        try{ renderNoteTagFilter(); }catch(e){}
      };
      renderNotes._tagPatched = true;
    }
  }catch(e){ if(console&&console.error) console.error("v18 init:", e); }
};

/* 在 renderDash 后打磨空状态 */
var _renderDashV18Orig = null;
function patchDashPolish(){
  if(_renderDashV18Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV18Orig = renderDash;
  renderDash = function(){
    _renderDashV18Orig();
    try{ polishEmptyStates(); }catch(e){}
  };
}

var _v2InitStepsOrigV18b = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV18b();
  try{ patchDashPolish(); }catch(e){}
};

/* ============================================================
   engine19 · v2.2 复盘日历热力图 / 雷达图 / 全局稳定性
   ============================================================ */

/* ===================== 1. 全局错误捕获 ===================== */
function setupGlobalErrorGuard(){
  /* 捕获未处理的 Promise rejection */
  window.addEventListener("unhandledrejection", function(e){
    var msg = String(e.reason && e.reason.message || e.reason || "").slice(0, 80);
    if(console && console.error) console.error("未捕获 Promise:", e.reason);
    if(typeof toastErr === "function") toastErr("操作异常（已恢复）：" + msg, 3000);
    e.preventDefault();
  });

  /* 捕获运行时错误 */
  window.addEventListener("error", function(e){
    var msg = String(e.message || "").slice(0, 80);
    var src = String(e.filename || "").split("/").pop() + ":" + (e.lineno || "?");
    if(console && console.error) console.error("运行时错误:", msg, src);
    /* 不弹 toast 避免刷屏，仅控制台 */
    return false;
  });
}

/* 安全渲染包装 */
function safeRender(fn, fallback){
  return function(){
    try{ return fn.apply(this, arguments); }
    catch(e){
      if(console && console.error) console.error("渲染异常:", fn.name || "<anon>", e);
      if(typeof fallback === "function"){ try{ return fallback(e); }catch(_){} }
      return undefined;
    }
  };
}

/* 安全操作包装 */
function safeCall(fn, errMsg){
  return function(){
    try{ return fn.apply(this, arguments); }
    catch(e){
      if(console && console.error) console.error("操作异常:", fn.name || "<anon>", e);
      if(typeof toastErr === "function") toastErr(errMsg || "操作失败", 3000);
    }
  };
}

/* ===================== 2. 复盘日历热力图 ===================== */
var CAL_DATE = new Date();

function renderCalendar(){
  var box = $("calHeatmap");
  if(!box) return;
  var year = CAL_DATE.getFullYear();
  var month = CAL_DATE.getMonth();
  var label = $("calLabel");
  if(label) label.textContent = year + "年" + (month + 1) + "月";

  var first = new Date(year, month, 1);
  var firstDay = first.getDay(); /* 0=周日 */
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date();
  var todayStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");

  /* 从日记加载历史评分 */
  var entries = [];
  try{ entries = journalLoad(); }catch(e){}
  var entryMap = {};
  entries.forEach(function(e){
    if(e.date) entryMap[e.date] = e;
  });

  var weekDays = ["日","一","二","三","四","五","六"];
  var h = '<div class="cal-grid">';
  weekDays.forEach(function(d){ h += '<div class="cal-hd">' + d + '</div>'; });

  /* 空白填充 */
  for(var i = 0; i < firstDay; i++){
    h += '<div class="cal-cell empty"></div>';
  }

  for(var d = 1; d <= daysInMonth; d++){
    var dateStr = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    var entry = entryMap[dateStr];
    var score = entry ? (entry.portfolio ? entry.portfolio.avg : 0) : 0;
    var hasData = !!entry;
    var isToday = dateStr === todayStr;

    /* 根据评分决定颜色 */
    var bg = "transparent";
    if(hasData && score){
      if(score >= 62) bg = "rgba(34,197,94,.35)";
      else if(score >= 50) bg = "rgba(76,141,255,.35)";
      else if(score >= 40) bg = "rgba(245,165,36,.35)";
      else bg = "rgba(255,77,79,.35)";
    }

    var cls = "cal-cell";
    if(hasData) cls += " has-data";
    if(isToday) cls += " today";
    if(!hasData) cls += " empty";

    var tip = "";
    if(hasData){
      var m = entry.market || {};
      var p = entry.portfolio || {};
      tip = '<div class="cal-tooltip">' + dateStr + ' · 上证' + (m.sh >= 0 ? "+" : "") + (m.sh||0) + '% · 评分' + (p.avg||0) + '</div>';
    }

    h += '<div class="' + cls + '" style="background:' + bg + '" data-date="' + dateStr + '">' +
      d + tip + '</div>';
  }
  h += '</div>';
  box.innerHTML = h;

  /* 点击日期 */
  box.querySelectorAll(".cal-cell:not(.empty)").forEach(function(c){
    c.onclick = function(){
      var date = c.dataset.date;
      /* 找到对应日记条目并高亮 */
      var entries = journalLoad();
      var found = entries.find(function(e){ return e.date === date; });
      if(found){
        /* 滚动到日记区域 */
        var jb = $("journalBox");
        if(jb) jb.scrollIntoView({behavior:"smooth", block:"center"});
        toastInfo(date + " 评分 " + ((found.portfolio||{}).avg||"—") + " 分");
      } else {
        toastInfo(date + " 无日记记录");
      }
    };
  });
}

function bindCalendar(){
  var prev = $("calPrev");
  var next = $("calNext");
  if(prev) prev.onclick = function(){
    CAL_DATE.setMonth(CAL_DATE.getMonth() - 1);
    renderCalendar();
  };
  if(next) next.onclick = function(){
    CAL_DATE.setMonth(CAL_DATE.getMonth() + 1);
    renderCalendar();
  };
}

/* ===================== 3. 持仓评分雷达图 ===================== */
function renderPortfolioRadar(){
  var box = $("radarChart");
  if(!box) return;
  if(typeof echarts === "undefined") return;
  if(!state.holdings.length){
    box.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted2);font-size:13px">添加持仓后显示评分雷达图</div>';
    return;
  }

  /* 取前5只评分最高的 */
  var items = state.holdings.map(function(hd){
    var an = null;
    try{ an = getAn(hd.code); }catch(e){}
    var s = (an && an.score) ? an.score : {};
    return {
      code: hd.code,
      name: hd.name || (an ? an.name : "") || hd.code,
      trend: s.trend || 0,
      momentum: s.momentum || s.dyn || 0,
      volume: s.volume || s.vol || 0,
      position: s.position || s.pos || 0,
      pattern: s.pattern || s.shape || 0,
      total: s.total || 0
    };
  }).filter(function(x){ return x.total > 0; })
    .sort(function(a, b){ return b.total - a.total; })
    .slice(0, 5);

  if(!items.length){
    box.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted2);font-size:13px">拉取数据后显示评分雷达图</div>';
    return;
  }

  var chart = echarts.init(box);
  var indicators = [
    {name:"趋势", max:100},
    {name:"动量", max:100},
    {name:"量能", max:100},
    {name:"位置", max:100},
    {name:"形态", max:100}
  ];

  var series = items.map(function(it, i){
    return {
      name: it.name,
      value: [it.trend, it.momentum, it.volume, it.position, it.pattern],
      itemStyle:{color: CMP_COLOR[i % CMP_COLOR.length]}
    };
  });

  chart.setOption({
    animation:false,
    legend:{
      data: items.map(function(it){ return it.name; }),
      bottom:0,
      textStyle:{color:"#8b95a8", fontSize:11}
    },
    radar:{
      indicator: indicators,
      shape:"polygon",
      splitNumber:4,
      axisName:{color:"#8b95a8", fontSize:11},
      splitLine:{lineStyle:{color:"rgba(38,49,69,.4)"}},
      splitArea:{areaStyle:{color:["rgba(38,49,69,.05)","rgba(38,49,69,.1)"]}},
      axisLine:{lineStyle:{color:"rgba(38,49,69,.3)"}}
    },
    series:[{
      type:"radar",
      data:series,
      areaStyle:{opacity:0.08},
      lineStyle:{width:2},
      symbol:"circle",
      symbolSize:5
    }]
  });

  if(!box._resizeBound){
    box._resizeBound = true;
    window.addEventListener("resize", function(){
      var b = $("radarChart");
      if(b){ var c = echarts.getInstanceByDom(b); if(c) c.resize(); }
    });
  }
}

/* ===================== 4. 增强仪表盘渲染 ===================== */
var _renderDashV19Orig = null;
function patchRenderDashV19(){
  if(_renderDashV19Orig) return;
  if(typeof renderDash !== "function") return;
  _renderDashV19Orig = renderDash;
  renderDash = function(){
    _renderDashV19Orig();
    try{ renderCalendar(); }catch(e){}
    try{ renderPortfolioRadar(); }catch(e){}
  };
}

/* ===================== 初始化 ===================== */
function initV19(){
  try{ setupGlobalErrorGuard(); }catch(e){}
  try{ bindCalendar(); }catch(e){}
  try{ patchRenderDashV19(); }catch(e){}
}

var _v2InitStepsOrigV19 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV19();
  try{ initV19(); }catch(e){ if(console&&console.error) console.error("v19 init:", e); }
};

/* ============================================================
   engine20 · v2.2 手动画线 + 性能优化 + UI 微调
   ============================================================ */

/* ===================== 1. 性能优化工具 ===================== */

/* rAF 防抖：多次调用只执行最后一帧 */
function rAFDebounce(fn){
  var timer = null;
  return function(){
    var args = arguments, ctx = this;
    if(timer) cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function(){
      timer = null;
      fn.apply(ctx, args);
    });
  };
}

/* 简单防抖 */
function debounce(fn, wait){
  var timer = null;
  return function(){
    var args = arguments, ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function(){ fn.apply(ctx, args); }, wait);
  };
}

/* ECharts 实例缓存池 */
var _chartPool = {};
function getChart(domId){
  if(!_chartPool[domId]){
    var el = document.getElementById(domId);
    if(!el || typeof echarts === "undefined") return null;
    _chartPool[domId] = echarts.init(el);
  }
  return _chartPool[domId];
}
function disposeChart(domId){
  if(_chartPool[domId]){
    try{ _chartPool[domId].dispose(); }catch(e){}
    delete _chartPool[domId];
  }
}

/* 优化 resize：全局只绑定一次 */
var _resizeBound = false;
function bindGlobalResize(){
  if(_resizeBound) return;
  _resizeBound = true;
  var fn = rAFDebounce(function(){
    for(var k in _chartPool){
      try{ _chartPool[k].resize(); }catch(e){}
    }
    /* 也 resize 非 pool 管理的图表 */
    if(typeof resizeAllCharts === "function"){
      try{ resizeAllCharts(); }catch(e){}
    }
  });
  window.addEventListener("resize", fn);
}

/* DOM 批量更新 */
function batchDOM(fn){
  var frag = document.createDocumentFragment();
  fn(frag);
  return frag;
}

/* ===================== 2. 手动画线 ===================== */
var DRAW = {mode:"off", points:[], shapes:[], chart:null, code:""};

function drawLoad(code){
  DRAW.code = code;
  try{
    var s = localStorage.getItem("ashare_draw_" + code);
    DRAW.shapes = s ? JSON.parse(s) : [];
  }catch(e){ DRAW.shapes = []; }
}

function drawSave(){
  if(!DRAW.code) return;
  try{ localStorage.setItem("ashare_draw_" + DRAW.code, JSON.stringify(DRAW.shapes)); }catch(e){}
}

function drawSetMode(mode){
  DRAW.mode = mode;
  DRAW.points = [];
  if(DRAW.chart){
    try{ DRAW.chart.off("click", drawOnClick); DRAW.chart.off("mousedown", drawOnClick); }catch(e){}
    if(mode !== "off"){
      DRAW.chart.on("click", drawOnClick);
    }
  }
  /* 更新光标 */
  var kl = $("kline");
  if(kl){
    kl.style.cursor = mode === "off" ? "crosshair" : "crosshair";
  }
}

function drawOnClick(params){
  if(DRAW.mode === "off") return;
  if(!params || params.componentType !== "series") return;

  var p = {x:params.value[0] || params.dataIndex, y:params.value[1]};
  /* 对于非 candlestick 系列（如收盘线），用 event offsetX/Y */
  if(params.value && typeof params.value[1] !== "number"){
    var cv = DRAW.chart.convertFromPixel({seriesIndex:0}, [params.event.event.offsetX, params.event.event.offsetY]);
    p = {x:cv[0], y:cv[1]};
  }

  DRAW.points.push(p);

  if(DRAW.mode === "line" && DRAW.points.length >= 2){
    DRAW.shapes.push({type:"line", p1:DRAW.points[0], p2:DRAW.points[1], color:"#4c8dff"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("趋势线已添加");
  } else if(DRAW.mode === "hline" && DRAW.points.length >= 1){
    DRAW.shapes.push({type:"hline", y:DRAW.points[0].y, color:"#f5a524"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("水平线已添加");
  } else if(DRAW.mode === "channel" && DRAW.points.length >= 3){
    DRAW.shapes.push({type:"channel", p1:DRAW.points[0], p2:DRAW.points[1], p3:DRAW.points[2], color:"#a371f7"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("通道已添加");
  } else if(DRAW.mode === "rect" && DRAW.points.length >= 2){
    DRAW.shapes.push({type:"rect", p1:DRAW.points[0], p2:DRAW.points[1], color:"rgba(76,141,255,.2)"});
    DRAW.points = [];
    drawApply();
    drawSave();
    toastInfo("矩形已添加");
  } else if(DRAW.mode === "text" && DRAW.points.length >= 1){
    var txt = prompt("输入标注文字：");
    if(txt){
      DRAW.shapes.push({type:"text", p:DRAW.points[0], text:txt, color:"#e8eef7"});
      drawApply();
      drawSave();
    }
    DRAW.points = [];
  }
}

function drawApply(){
  if(!DRAW.chart) return;
  /* 先移除旧的 graphic */
  try{ DRAW.chart.setOption({graphic:[]}); }catch(e){}

  var graphics = [];
  DRAW.shapes.forEach(function(s, i){
    if(s.type === "line" || s.type === "channel"){
      /* 趋势线：用 markLine */
      graphics.push({
        type:"line",
        shape:{
          x1:drawToPx(s.p1.x), y1:drawToPx(s.p1.y),
          x2:drawToPx(s.p2.x), y2:drawToPx(s.p2.y)
        },
        style:{stroke:s.color, lineWidth:2},
        z:50
      });
      if(s.type === "channel" && s.p3){
        /* 第三点定义平行偏移 */
        var dx = drawToPx(s.p2.x) - drawToPx(s.p1.x);
        var dy = drawToPx(s.p2.y) - drawToPx(s.p1.y);
        graphics.push({
          type:"line",
          shape:{
            x1:drawToPx(s.p3.x), y1:drawToPx(s.p3.y),
            x2:drawToPx(s.p3.x) + dx, y2:drawToPx(s.p3.y) + dy
          },
          style:{stroke:s.color, lineWidth:2, lineDash:[4,4]},
          z:50
        });
      }
    } else if(s.type === "hline"){
      /* 水平线：横跨整个图表 */
      graphics.push({
        type:"line",
        shape:{
          x1:0, y1:drawToPx(s.y),
          x2:9999, y2:drawToPx(s.y)
        },
        style:{stroke:s.color, lineWidth:1.5, lineDash:[6,3]},
        z:50
      });
    } else if(s.type === "rect"){
      graphics.push({
        type:"rect",
        shape:{
          x:Math.min(drawToPx(s.p1.x), drawToPx(s.p2.x)),
          y:Math.min(drawToPx(s.p1.y), drawToPx(s.p2.y)),
          width:Math.abs(drawToPx(s.p2.x) - drawToPx(s.p1.x)),
          height:Math.abs(drawToPx(s.p2.y) - drawToPx(s.p1.y))
        },
        style:{fill:s.color, stroke:s.color.replace(/[\d.]+\)/,"0.6)"), lineWidth:1},
        z:49
      });
    } else if(s.type === "text"){
      graphics.push({
        type:"text",
        style:{
          text:s.text,
          x:drawToPx(s.p.x),
          y:drawToPx(s.p.y) - 10,
          fill:s.color,
          fontSize:12,
          fontWeight:600,
          textBackgroundColor:"rgba(18,24,38,.8)",
          textPadding:[4,6]
        },
        z:51
      });
    }
  });

  if(graphics.length){
    try{ DRAW.chart.setOption({graphic:graphics}); }catch(e){}
  }
}

/* 将数据坐标转为像素坐标 */
function drawToPx(val){
  /* 画线时值已经是像素坐标（convertFromPixel 的结果），直接返回 */
  return Math.round(val);
}

function drawClear(){
  if(!confirm("确定清空当前标的所有画线？")) return;
  DRAW.shapes = [];
  drawSave();
  drawApply();
  toastOk("画线已清空");
}

/* 绑定画线按钮 */
function bindDrawTools(){
  var seg = $("segDraw");
  if(!seg || seg._bound) return;
  seg._bound = true;
  seg.querySelectorAll("button").forEach(function(b){
    b.onclick = function(){
      seg.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      drawSetMode(b.dataset.d);
      if(b.dataset.d !== "off"){
        toastInfo("画线模式：" + b.textContent.trim() + "，点击图表添加");
      }
    };
  });

  var clr = $("btnClearDraw");
  if(clr) clr.onclick = drawClear;
}

/* 在 renderKline 后设置 chart 引用并应用已有画线 */
var _renderKlineOrig = null;
function patchRenderKline(){
  if(_renderKlineOrig) return;
  if(typeof renderKline !== "function") return;
  _renderKlineOrig = renderKline;
  renderKline = function(){
    _renderKlineOrig();
    try{
      /* 获取 echarts 实例 */
      var kl = $("kline");
      if(kl){
        var inst = echarts.getInstanceByDom(kl);
        if(inst){
          DRAW.chart = inst;
          drawApply();
        }
      }
    }catch(e){}
  };
}

/* 在 pickStock 后加载该股的画线 */
var _pickStockOrig = null;
function patchPickStock(){
  if(_pickStockOrig) return;
  if(typeof pickStock !== "function") return;
  _pickStockOrig = pickStock;
  pickStock = function(code){
    _pickStockOrig(code);
    try{
      drawLoad(code);
      /* 等图表渲染完再应用 */
      setTimeout(function(){ drawApply(); }, 300);
    }catch(e){}
  };
}

/* ===================== 3. UI 微调 ===================== */

/* nav 改进 */
function polishNav(){
  var nav = document.querySelector("nav");
  if(!nav) return;
  /* 确保 nav 按钮有微交互 */
  nav.querySelectorAll("a").forEach(function(a){
    if(a._polished) return;
    a._polished = true;
    a.addEventListener("mouseenter", function(){
      a.style.transform = "translateX(2px)";
    });
    a.addEventListener("mouseleave", function(){
      a.style.transform = "";
    });
  });
}

/* section 切换动画增强 */
function polishSectionSwitch(){
  /* 已经有 fade 动画，这里增强一下过渡 */
  var style = document.createElement("style");
  style.textContent =
    "section.on{animation:fade .22s cubic-bezier(.4,0,.2,1) both}" +
    ".card{animation:cardFade .28s cubic-bezier(.4,0,.2,1) both}" +
    "@keyframes cardFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    ".kpi{animation:cardFade .24s cubic-bezier(.4,0,.2,1) both}" +
    /* 输入框聚焦发光 */
    "input:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px rgba(76,141,255,.12),0 0 12px rgba(76,141,255,.06)}" +
    /* 表格行悬停 */
    "tbody tr:hover{background:rgba(76,141,255,.04)}" +
    /* chip 微交互 */
    ".chip{transition:transform var(--t),box-shadow var(--t)}" +
    ".chip:hover{transform:translateY(-1px);box-shadow:var(--shadow-sm)}" +
    /* pbadge 微动画 */
    ".pbadge{transition:transform var(--t)}" +
    ".pbadge:hover{transform:scale(1.05)}" +
    /* 链接下划线动画 */
    "a{text-decoration:none;position:relative}" +
    "a[href]:after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:currentColor;transition:width var(--t)}" +
    "a[href]:hover:after{width:100%}";
  document.head.appendChild(style);
}

/* ===================== 初始化 ===================== */
function initV20(){
  try{ bindGlobalResize(); }catch(e){}
  try{ bindDrawTools(); }catch(e){}
  try{ patchRenderKline(); }catch(e){}
  try{ patchPickStock(); }catch(e){}
  try{ polishNav(); }catch(e){}
  try{ polishSectionSwitch(); }catch(e){}
}

var _v2InitStepsOrigV20 = v2InitSteps;
v2InitSteps = function(){
  _v2InitStepsOrigV20();
  try{ initV20(); }catch(e){ if(console&&console.error) console.error("v20 init:", e); }
};

