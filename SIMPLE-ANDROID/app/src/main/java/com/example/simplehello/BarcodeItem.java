package com.example.simplehello;

public class BarcodeItem {
    private final String value;
    private final String format;
    private final String timestamp;

    public BarcodeItem(String value, String format, String timestamp) {
        this.value = value;
        this.format = format;
        this.timestamp = timestamp;
    }

    public String getValue() { return value; }
    public String getFormat() { return format; }
    public String getTimestamp() { return timestamp; }
}
