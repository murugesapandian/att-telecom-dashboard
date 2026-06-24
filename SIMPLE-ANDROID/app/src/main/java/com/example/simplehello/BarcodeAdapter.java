package com.example.simplehello;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class BarcodeAdapter extends RecyclerView.Adapter<BarcodeAdapter.Holder> {

    private final List<BarcodeItem> items;

    public BarcodeAdapter(List<BarcodeItem> items) {
        this.items = items;
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_barcode, parent, false);
        return new Holder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int position) {
        BarcodeItem it = items.get(position);
        holder.value.setText(it.getValue());
        holder.format.setText(it.getFormat());
        holder.timestamp.setText(it.getTimestamp());
    }

    @Override
    public int getItemCount() { return items.size(); }

    static class Holder extends RecyclerView.ViewHolder {
        TextView value, format, timestamp;
        Holder(@NonNull View itemView) {
            super(itemView);
            value = itemView.findViewById(R.id.col_value);
            format = itemView.findViewById(R.id.col_format);
            timestamp = itemView.findViewById(R.id.col_timestamp);
        }
    }
}
