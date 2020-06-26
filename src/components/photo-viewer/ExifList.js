import React from "react"
import styled from "styled-components"

import { rhythm, scale } from "../../utils/typography"

import moment from "moment"
import "moment/locale/zh-cn"
import Icon from "../Icon"
import GoogleMapIcon from "./GoogleMapIcon"
import BaiduMapIcon from "./BaiduMapIcon"

const Container = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  margin: ${rhythm(1)} 0;
`

const Pair = styled.div`
  width: ${rhythm(15)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #0002;
  padding-bottom: ${rhythm(0.2)};
`

const Name = styled.div`
  margin-right: ${rhythm(2)};
  white-space: nowrap;
  ::after {
    content: ":";
  }
`

const Value = styled.div``

const GPSPair = styled.div`
  width: ${rhythm(8)};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${rhythm(0.2)};
  font-size: ${rhythm(0.5)};
`

const GPSCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    margin: 0 8px;
    margin-top: 12px;
  }
`

const GPSValue = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const fmtExposureTime = t => {
  if (t < 1) {
    return `${(t * 1000).toFixed(2)}ms`
  }
  return `${t.toFixed(2)}s`
}

const calcAperture = metadata => {
  let ret = Math.pow(2, metadata.ApertureValue / 2)
  return ret.toFixed(2)
}

const calcMaxAperture = metadata => {
  let ret = Math.pow(2, metadata.MaxApertureValue / 2)
  return ret.toFixed(2)
}

const makeBaiduMapUrl = gps => {
  let url = "http://api.map.baidu.com/marker?location="
  url += gps.latitude.toFixed(6)
  url += ","
  url += gps.longitude.toFixed(6)
  url += "&title=" + encodeURI("拍摄位置")
  url += "&content=" + encodeURI("拍摄位置")
  url += "&output=html&src=tajoy.net"
  return url
}

const makeGoogleMapUrl = gps => {
  let url = "http://maps.google.com/maps?q=loc:"
  url += gps.latitude.toFixed(6)
  url += ","
  url += gps.longitude.toFixed(6)
  return url
}

const ExifList = ({ photo }) => {
  const {
    childImageExt: { metadata },
  } = photo
  console.log("metadata", metadata)
  return (
    <Container>
      <Pair>
        <Name>拍摄时间</Name>
        <Value>{moment(metadata.CreateDate).format("ll LTS")}</Value>
      </Pair>
      {metadata.gps && (
        <Pair>
          <Name>拍摄位置</Name>
          <GPSValue>
            <GPSCol>
              <GPSPair>
                <Name>经度</Name>
                <Value style={{ width: rhythm(2) }}>
                  {metadata.gps.longitude.toFixed(3)}
                </Value>
              </GPSPair>
              <GPSPair>
                <Name>维度</Name>
                <Value style={{ width: rhythm(2) }}>
                  {metadata.gps.latitude.toFixed(3)}
                </Value>
              </GPSPair>
            </GPSCol>
            <GPSCol>
              <a
                href={makeBaiduMapUrl(metadata.gps)}
                target="_blank"
                title="百度地图中显示"
              >
                <BaiduMapIcon />
              </a>
            </GPSCol>
            <GPSCol>
              <a
                href={makeGoogleMapUrl(metadata.gps)}
                target="_blank"
                title="谷歌地图中显示"
              >
                <GoogleMapIcon />
              </a>
            </GPSCol>
          </GPSValue>
        </Pair>
      )}
      <Pair>
        <Name>摄像机品牌</Name>
        <Value>{metadata.Make}</Value>
      </Pair>
      <Pair>
        <Name>摄像机型号</Name>
        <Value>{metadata.Model}</Value>
      </Pair>
      <Pair>
        <Name>镜头型号</Name>
        <Value>{metadata.LensModel}</Value>
      </Pair>
      <Pair>
        <Name>曝光时长</Name>
        <Value>{fmtExposureTime(metadata.ExposureTime)}</Value>
      </Pair>
      <Pair>
        <Name>曝光模式</Name>
        <Value>{metadata.ExposureMode}</Value>
      </Pair>
      <Pair>
        <Name>曝光程序</Name>
        <Value>{metadata.ExposureProgram}</Value>
      </Pair>
      <Pair>
        <Name>ISO</Name>
        <Value>{metadata.ISO}</Value>
      </Pair>
      <Pair>
        <Name>光圈</Name>
        <Value>{calcAperture(metadata)}</Value>
      </Pair>
      {metadata.MaxApertureValue && (
        <Pair>
          <Name>最大光圈</Name>
          <Value>{calcMaxAperture(metadata)}</Value>
        </Pair>
      )}
      <Pair>
        <Name>焦距</Name>
        <Value>{metadata.FocalLength}</Value>
      </Pair>
      <Pair>
        <Name>35mm等效焦距</Name>
        <Value>{metadata.FocalLengthIn35mmFormat}</Value>
      </Pair>
      <Pair>
        <Name>后期软件</Name>
        <Value>{metadata.Software}</Value>
      </Pair>
    </Container>
  )
}

export default ExifList
