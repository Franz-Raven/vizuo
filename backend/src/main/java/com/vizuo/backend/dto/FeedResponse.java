package com.vizuo.backend.dto;

import java.util.List;

public class FeedResponse<T> {
    private List<T> items;
    private String nextCursor;

    public FeedResponse() {}

    public FeedResponse(List<T> items, String nextCursor) {
        this.items = items;
        this.nextCursor = nextCursor;
    }

    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public String getNextCursor() {
        return nextCursor;
    }

    public void setNextCursor(String nextCursor) {
        this.nextCursor = nextCursor;
    }
}
