package com.projekti;


import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class JsonHelper<T> {
  final Class<T> type;

  public JsonHelper(Class<T> type) {
    this.type = type;
  }

  public String serializeJson(T model) throws Exception {
    return new GsonBuilder().create().toJson(model, this.type);
  }

  public String serializeJsonList(T[] models) throws Exception {
    return new GsonBuilder().create().toJson(models, TypeToken.getArray(this.type).getType());
  }

  public T deserializeJson(String json) throws Exception {
    return new GsonBuilder().create().fromJson(json, this.type);
  }

  public T[] deserializeJsonList(String json) throws Exception {
    T[] arr = new GsonBuilder().create().fromJson(json, TypeToken.getArray(this.type).getType());
    return arr;
  }
}
