<%@page import="net.sf.json.JSONArray"%>
<%@page import="org.apache.commons.httpclient.util.DateUtil"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.security.NoSuchAlgorithmException"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="net.ion.ice.sp.manager.config.ConfigurationManager"%>
<%@page import="net.sf.json.JSONObject"%>
<%@ page import="java.security.MessageDigest, java.util.*" %>
<%!
	//암호화에 사용될 타임스탬프의 패턴
	static final String timeStampPattern = "yyyyMMddHHmmss";
	Properties prop = ConfigurationManager.getConfigPropertyFile();
	String API_SERVER = prop.getProperty("apifarm_url");

	//필수 파라미터 전달 확인
	public boolean hasRequiredParam(HttpServletRequest req, String ... required) {
		boolean isOk = true;
		for(String requiredName : required){
			String value = String.valueOf(req.getParameter(requiredName));
			boolean isEmpty  = ("null".equals(value) || value.trim().length() < 1); 
			if(isEmpty){
				isOk = false;
				break;
			}
		}
		return isOk;
	}

	//타임스탬프 문자열 생성 
	public String getTimeStamp(Date date) {
		if(date == null) date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(timeStampPattern);
		return sdf.format(date);
	}
	
	public String getCloseDate(Date date, Integer add){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_MONTH, add);
		Date calc = cal.getTime();
		String rtn = sdf.format(calc);
		return rtn + "235959";
	}
	

	public Map<String, Object> buildParamMap(HttpServletRequest request, Map<String, String> preMap) throws Exception {
		Map<String, Object> rtnMap = new HashMap<String, Object>();


		String lgu_customer_platform = prop.getProperty("lgu_customer_platform");
                String LGD_RETURNURL         = request.getParameter("frontDomain") + "/" + prop.getProperty("lgu_returnurl");// FOR MANUAL
		
		/* 파라미터로 전달되는 값 */
	    String LGD_PRODUCTINFO      = request.getParameter("prodName");							//상품명
	    String LGD_AMOUNT           = request.getParameter("price");                   			//결제금액
	    String LGD_OID              = preMap.get("orderId");                      				//주문번호(상점정의 유니크한 주문번호를 입력하세요)
    	String LGD_BUYER			= request.getParameter("user");								//구매자 
	    String LGD_CUSTOM_USABLEPAY = request.getParameter("LGD_CUSTOM_USABLEPAY");        		//상점정의 초기결제수단		
		String LGD_CASNOTEURL		= preMap.get("LGD_CASNOTEURL");
	    
	    
	    /* 고정값 */
	    String CST_MID              = preMap.get("CST_MID");                      								//LG유플러스로 부터 발급받으신 상점아이디를 입력하세요.
	    String LGD_MID              = ("test".equals(lgu_customer_platform.trim())?"t":"") + CST_MID;  	//테스트 아이디는 't'를 제외하고 입력하세요.
	    String LGD_MERTKEY          = preMap.get("LGD_MERTKEY");                  								//상점MertKey(mertkey는 상점관리자 -> 계약정보 -> 상점정보관리에서 확인하실수 있습니다) => 일단 컨피그에서 긁어와봤어
	    
	
	    String LGD_TIMESTAMP        = getTimeStamp(new Date()); //타임스탬프
	    String LGD_BUYEREMAIL       = request.getParameter("LGD_BUYEREMAIL");               	//구매자 이메일

	    rtnMap.put("CST_PLATFORM", lgu_customer_platform);
	    rtnMap.put("LGD_MID", LGD_MID);
	    rtnMap.put("LGD_OID", LGD_OID);
	    rtnMap.put("LGD_AMOUNT", LGD_AMOUNT);
	    //rtnMap.put("LGD_MERTKEY", LGD_MERTKEY);
	    rtnMap.put("LGD_BUYER", LGD_BUYER);
	    rtnMap.put("LGD_PRODUCTINFO", LGD_PRODUCTINFO);
	    rtnMap.put("LGD_TIMESTAMP", LGD_TIMESTAMP);
	    rtnMap.put("LGD_CUSTOM_SKIN", "red");
	    rtnMap.put("LGD_BUYERID", LGD_BUYER);	//나중에 수정 
	    rtnMap.put("LGD_BUYERIP", request.getRemoteAddr());

	    //4일 더하고 23시 59분 29초까지 
	    rtnMap.put("LGD_CLOSEDATE", getCloseDate(new Date(), 4));
	    rtnMap.put("LGD_CUSTOM_USABLEPAY", LGD_CUSTOM_USABLEPAY);
	    
	    rtnMap.put("LGD_RETURNURL", LGD_RETURNURL);
	    rtnMap.put("LGD_CASNOTEURL", LGD_CASNOTEURL);
	    rtnMap.put("LGD_HASHDATA", makeLGUHash(LGD_MID, LGD_OID, LGD_AMOUNT, LGD_TIMESTAMP, LGD_MERTKEY));
	    rtnMap.put("LGD_CUSTOM_PROCESSTYPE", "TWOTR");
	    
	    rtnMap.put("LGD_VERSION", "JSP_SmartXPay_1.0");
	    rtnMap.put("LGD_WINDOW_VER", "2.5");
	    rtnMap.put("LGD_WINDOW_TYPE", "iframe");
	    rtnMap.put("LGD_CUSTOM_SWITCHINGTYPE", "IFRAME");
	    
	    rtnMap.put("CST_MID", CST_MID);
	    rtnMap.put("LGD_BUYEREMAIL", LGD_BUYEREMAIL);
	    
	    rtnMap.put("LGD_ENCODING", "UTF-8");
	    rtnMap.put("LGD_ENCODING_NOTEURL", "UTF-8");
	    rtnMap.put("LGD_ENCODING_RETURNURL", "UTF-8");


	    rtnMap.put("pgSeq", preMap.get("pgSeq"));
	    
		return rtnMap;
	}	
	
	public Map<String, String> generateParamMap (String orderId, String pgMallId, String pgSeq, String pgMertkey, String pgCasnoteurl ){
		Map<String, String> rtnMap = new HashMap<String, String>();
		rtnMap.put("CST_MID", pgMallId);
		rtnMap.put("pgSeq", pgSeq);
		rtnMap.put("LGD_MERTKEY", pgMertkey);
		System.out.println("LGD_CASNOTEURL > " + pgCasnoteurl);
		rtnMap.put("LGD_CASNOTEURL", pgCasnoteurl);
		rtnMap.put("orderId", orderId);
		return rtnMap;
	}
	
	
	public String makeLGUHash(String LGD_MID, String LGD_OID, String LGD_AMOUNT, String LGD_TIMESTAMP, String LGD_MERTKEY) throws NoSuchAlgorithmException{
	    StringBuffer sb = new StringBuffer();
	    sb.append(LGD_MID);
	    sb.append(LGD_OID);
	    sb.append(LGD_AMOUNT);
	    sb.append(LGD_TIMESTAMP);
	    sb.append(LGD_MERTKEY);

	    byte[] bNoti = sb.toString().getBytes();
	    MessageDigest md = MessageDigest.getInstance("MD5");
	    byte[] digest = md.digest(bNoti);

	    StringBuffer strBuf = new StringBuffer();
	    for (int i=0 ; i < digest.length ; i++) {
	        int c = digest[i] & 0xff;
	        if (c <= 15){
	            strBuf.append("0");
	        }
	        strBuf.append(Integer.toHexString(c));
	    }
		return strBuf.toString();
	}	

	public Map<String, Object> setReturnCode(Map<String, Object> rtnMap, String code, String message){
		if(code.toUpperCase().equals("SUCCESS")){
			message = "SUCCESS";
		}
		rtnMap.put("code", code);
		rtnMap.put("message", message);
		return rtnMap;
	}
	
	public JSONObject extractJsonObject(HttpServletRequest request, String key){
		JSONObject jObj = new JSONObject();
		try{
			jObj = (JSONObject) request.getAttribute(key);
			System.out.println("LGD OCC PG 정보 조회 결과 오브젝트");
			System.out.println(jObj.toString());
		}catch(Exception ex){
			System.err.println("LGD Required HttpServlertRequest 에서 [ " + key + " ] 어트리뷰트를 찾을 수 없습니다");
			jObj = null;
		}
		return jObj;
	}
	
	
	/*
		이 작업을 하는 이유는 OCC 에서 보내주는 키값이 때로 존재하지도 않을 수 있기 때문에
		NullPointerException 방지를 위해 키가 없을 경우 공백으로 변환하는 작업이 필요함 
	*/
	public String extractValueFormJSON(JSONObject jObj, String key){
		String extractedValue = "";
		extractedValue = jObj.containsKey(key) ? jObj.getString(key) : ""; 
		return extractedValue;
	}
	
%>
<%

final String OCC_OBJECT_KEY = "pginfo";
final String OCC_OBJECT_ARRAY_KEY = "sitePgInfo";

System.out.println("================== lgu required =======================================");
String code = "ERROR";
String message = "";
Map<String, Object> rtnMap = new HashMap<String, Object>();
Map<String, Object> itemMap = new HashMap<String, Object>();

JSONObject occResult = extractJsonObject(request, OCC_OBJECT_KEY);
if(occResult != null){
	try{
		//여기서 뭘해야 되냐하면 
		// user price prodName orderId LGD_CUSTOM_USABLEPAY
		
		String networkResult = String.valueOf(occResult.getString("result"));
		if(!networkResult.equals("200")){
			JSONObject pureOcc = (JSONObject) occResult.get("result_msg");
			message = (pureOcc.containsKey("message"))? pureOcc.getString("message") : message;
			throw new Exception(message);
		}else{
			if(occResult.containsKey("code")){
				String occRtnCode = occResult.getString("code");
				if("E".equals(occRtnCode)){
					message = occResult.getString("message");
					throw new Exception(message);
				}
			}
		}
		
		String occReturnCode = occResult.getString("code");
		String occMessage = occResult.getString("message");
		if(occReturnCode == null || !"S".equals(occReturnCode)) {
			message = occMessage;
			throw new Exception(String.valueOf(occMessage));
		}
		
		JSONArray pgSiteInfo = occResult.getJSONArray(OCC_OBJECT_ARRAY_KEY);
		if(pgSiteInfo == null || pgSiteInfo.size() != 1){
			throw new Exception("서버에서 전달받은 PG 정보가 유효하지 않습니다");
		}
		// 여기까지 넘어오면 OCC 정보는 정상입니다.
		
		//OCC JSON 으로부터 추출할 수 있는 정보들 
		JSONObject pgInfo = (JSONObject) pgSiteInfo.get(0);
		String orderId = occResult.getString("orderCode");
		String pgSeq = extractValueFormJSON(pgInfo, "pgSeq");
		String pgMallId = extractValueFormJSON(pgInfo, "pgMallId");
		String pgCasnoteurl = extractValueFormJSON(pgInfo, "pgCasnoteurl");
		String pgMertHash = extractValueFormJSON(pgInfo, "pgMertHash");
		String pgMertkey = extractValueFormJSON(pgInfo, "pgMertkey");
		String pgPassword = extractValueFormJSON(pgInfo, "pgPassword");
		String pgBusinesseno = extractValueFormJSON(pgInfo, "pgBusinesseno");
		
		Map<String, String> preMap = generateParamMap(orderId, pgMallId, pgSeq, pgMertkey, pgCasnoteurl);
		itemMap = buildParamMap(request, preMap);
		code = "SUCCESS";
	}catch(Exception e){
		message = (message.length() < 1) ?  "This should not be happened. call CSCenter" : message;
		e.printStackTrace();
	}
}else{
	message = "This should not be happened. call CSCenter";
}


rtnMap.put("item", itemMap);
setReturnCode(rtnMap, code, message);
System.out.println("================== lgu required =======================================");

out.print(JSONObject.fromObject(rtnMap).toString());
%>