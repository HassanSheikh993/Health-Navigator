import React from 'react'
import heartlogo from '../assets/heartlogo.png'
import graph from '../assets/graph.png'
import fileIcon from '../assets/fileicon.png'
function TrackHealthcover() {
    return (
        <>
            <div className="coverbanner">
                <div className="heartimg">
                    <img src={heartlogo}></img>
                </div>
                <div className="coverheading">
                    <h2>"TRACK YOUR LIVERR HEALTH TRENDS AND PROGRESS"</h2>
                    <p>"monitor your liverr function over time with easy-to-read graphs and insight. stay informed about changes in your health and take proactive step towards better well-being."</p>
                </div>
            </div>
            <div className="visualgraph">
                <div className="graph">
                    <img src={heartlogo} id='heartimg'></img>
                    <img src={graph} id='graphimg'></img>
                </div>
                <div className="graphinfo">
                    <p>Liver function Trends-Interactive graph tracking ALT, AST, ALP, Bilirubin levels</p>
                    <p>Progress Bar-Visualize liver Health over weeks, months or years</p>
                </div>
            </div>

            <div className="previousreport">
                <h3>Compare Previous Report</h3>
                <h4>Previous Reports</h4>

                <div className="reportslist">
                    <div className="report">
                        <div className="reportinfo">
                        <input type="checkbox" value="1" class="circle-checkbox"/>
                            <img src={fileIcon}></img>
                            <p>Doc-of-saving-document-or-computer-files-vector</p>
                        </div>
                    </div>
                    <div className="report">
                        <div className="reportinfo">
                        <input type="checkbox" value="2" class="circle-checkbox"/>
                        <img src={fileIcon}></img>
                            <p>Doc-of-saving-document-or-computer-files-vector</p>
                        </div>
                    </div>
                    <div className="report">
                        <div className="reportinfo">
                        <input type="checkbox" value="3" class="circle-checkbox"/>
                        <img src={fileIcon}></img>
                            <p>Doc-of-saving-document-or-computer-files-vector</p>
                        </div>
                    </div>
                    <div className="report">
                        <div className="reportinfo">
                        <input type="checkbox" value="4" class="circle-checkbox"/>
                        <img src={fileIcon}></img>
                            <p>Doc-of-saving-document-or-computer-files-vector</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="reportbtn">
                <button>Analyze My trend Now</button>
                <button>Send Report To Doctor</button>

            </div>
        </>
    )
}
export default TrackHealthcover