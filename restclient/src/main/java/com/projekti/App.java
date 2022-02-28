package com.projekti;
import java.util.List;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

public final class App {
   
    static final String baseUrl = "http://localhost:3001/api";
    static final JsonHelper<Flight> json = new JsonHelper<>(Flight.class);
    public static void main(String[] args) throws Exception {
        int createRes = Integer.parseInt(post("/flight", json.serializeJson(new Flight(0, "Swiss","Prishtine","Zurich","23/06/2020","23/06/2020","450"))));
        System.out.println("post /flight " + createRes);

        Flight[] listAllRes = json.deserializeJsonList(get("/flight"));
        System.out.println("get /flight");
        for (Flight flight : listAllRes) {
            print(flight);
        }

        Flight findRes = json.deserializeJson(get("/flight/" + createRes));
        System.out.println("get /flight/:id");
        print(findRes);

        System.out.println("update /flight/:id");
        System.out.println(put("/flight/" + createRes, json.serializeJson(new Flight(createRes, "Swiss","Prishtine","Zurich","23/06/2020","23/06/2020","550"))));

        System.out.println("delete /flight/:id");
        System.out.println(delete("/flight/" + createRes));
    }

    private static void print(Flight flight) {
        System.out.printf("{ id = %d, fname = %s ,dcity = %s,acity = %s,ddate = %s,adate = %s,price = %s}\n", flight.getId(), flight.getFname(),
        flight.getDcity(),flight.getAcity(),flight.getDdate(),flight.getAdate(),flight.getPrice());
    }

    private static String get(String url) throws Exception {
        OkHttpClient client = new OkHttpClient();
        Request req = new Request.Builder().url(baseUrl + url).get().build();
        Response res = client.newCall(req).execute();
        return res.body().string();
    }

    private static String post(String url, String json) throws Exception {
        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
        Request req = new Request.Builder().url(baseUrl + url).post(body).build();
        Response res = client.newCall(req).execute();
        return res.body().string();
    }

    private static String put(String url, String json) throws Exception {
        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
        Request req = new Request.Builder().url(baseUrl + url).put(body).build();
        Response res = client.newCall(req).execute();
        return res.body().string();
    }

    private static String patch(String url, String json) throws Exception {
        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
        Request req = new Request.Builder().url(baseUrl + url).patch(body).build();
        Response res = client.newCall(req).execute();
        return res.body().string();
    }

    private static String delete(String url) throws Exception {
        OkHttpClient client = new OkHttpClient();
        Request req = new Request.Builder().url(baseUrl + url).delete().build();
        Response res = client.newCall(req).execute();
        return res.body().string();
    }
}
