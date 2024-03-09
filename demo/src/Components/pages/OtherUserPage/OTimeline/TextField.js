// TextField.js
import React from "react";

export default function TextField({ handleChange, handlePost, thread,placeholder }) {
  return (
    <div className="panel">
      <div className="panel-body">
        <textarea
          className="form-control"
          rows="2"
          onChange={handleChange}
          placeholder={placeholder}
          value={thread}
        ></textarea>
        <div className="mar-top clearfix">
        {thread.length > 0 && <button
            className="btn btn-sm btn-primary pull-right"
            type="submit"
            onClick={handlePost}
          >
           <i className="fa fa-pencil fa-fw"></i> Share
          </button>}
          
          <a className="btn btn-trans btn-icon fa fa-video-camera add-tooltip" href="#"></a>
          <a className="btn btn-trans btn-icon fa fa-camera add-tooltip" href="#"></a>
          <a className="btn btn-trans btn-icon fa fa-file add-tooltip" href="#"></a>
        </div>
      </div>
    </div>
  );
}
