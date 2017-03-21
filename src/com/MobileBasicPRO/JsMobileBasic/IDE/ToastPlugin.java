package com.MobileBasicPRO.JsMobileBasic.IDE;

import android.content.*;
import android.util.*;
import android.widget.*;
import org.apache.cordova.api.*;
import org.json.*;

public class ToastPlugin extends Plugin
{ 
	@Override 
	public PluginResult execute(String action, JSONArray data, String callbackId)
	{ 
		try
		{
			final String string = data.getString(0);
			ctx.getActivity().runOnUiThread(new Runnable() {

					public void run()
					{
						Toast.makeText(ctx.getActivity(), string, Toast.LENGTH_LONG).show();
					}
				});
		}
		catch (JSONException e)
		{}

		return new PluginResult(PluginResult.Status.OK); 
	} 
} 

