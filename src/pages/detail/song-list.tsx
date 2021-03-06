import React, { Component } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { PlayListService } from "~/services/playlist.service";
import { RequestParams } from "~/core/http";
import { Avatar, Button, Tabs } from "antd";
import { tenThoursand, dateFormat } from "~/shared/utils/common";
import MusicList from "~/components/shared/music-list";
import { PlayListCommentList } from "~/components/shared/comment-list";
import CollectorList from "~/components/shared/collector-list";

const components = {
  Wrapper: styled.section``,
  HeaderWrapper: styled.div`
    .coverImg {
      width: 200px;
      border-radius: 10px;
    }
    .info {
      padding-left: 30px;
      & > div {
        margin-bottom: 10px;
      }
    }
    .title {
      .flag {
        color: #cd5043;
        border: solid 1px #cd5043;
        border-radius: 3px;
        padding: 2px 5px;
      }
      .name {
        padding: 12px;
        font-size: 20px;
        font-weight: 500;
      }
    }
    .creator {
      .nickname {
        font-size: 12px;
        padding: 0 10px;
      }

      .create-time {
        color: #aeaeae;
      }
    }
    .action {
      padding: 10px 0;
      & > * {
        margin-right: 15px;
      }
    }
    .other {
      font-size: 12px;
      line-height: 25px;

      .description {
        white-space: nowrap;
        width: 240px;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #7f7f7f;
      }
    }
  `
};

interface SongListState {
  playlist: any;
}

interface SongListProps {
  id?: string;
}

export class SongList extends Component<SongListProps, SongListState> {
  private playListService = new PlayListService();

  constructor(props) {
    super(props);

    this.state = { playlist: null };
  }
  public componentDidMount() {
    this.getSongListDetail();
  }

  public render() {
    const { playlist } = this.state;

    return (
      <components.Wrapper>
        {playlist && this.getHeaderContainer()}
        {playlist && this.getTabsContainer()}
      </components.Wrapper>
    );
  }

  public getHeaderContainer() {
    const { playlist } = this.state;

    return (
      <components.HeaderWrapper className="flex-row">
        <div>
          <img alt="" className="coverImg" src={playlist.coverImgUrl}></img>
        </div>
        <div className="flex-auto padding-left info">
          <div className="title">
            <span className="flag">歌单</span>
            <span className="name">{playlist.name}</span>
          </div>
          <div className="creator">
            <Avatar
              className="avatar"
              size={24}
              src={playlist.creator.avatarUrl}
            ></Avatar>
            <a className="nickname">{playlist.creator.nickname}</a>
            <span className="create-time">
              {dateFormat(playlist.createTime)} 创建
            </span>
          </div>
          <div className="action">
            <Button shape="round">播放全部</Button>
            <Button shape="round">收藏</Button>
            <Button shape="round">分享</Button>
            <Button shape="round">下载全部</Button>
          </div>
          <div className="other">
            <div>
              <span>标 签:</span>
              {playlist.tags.map(item => (
                <a key={item}>{item}</a>
              ))}
            </div>
            <div>
              <span className="margin-right">
                <span>歌曲数:</span>
                <span>{playlist.tracks.length}</span>
              </span>
              <span>
                <span>播放数:</span>
                <span>{tenThoursand(playlist.playCount)}</span>
              </span>
            </div>
            <div className="description">简介: {playlist.description}</div>
          </div>
        </div>
      </components.HeaderWrapper>
    );
  }

  private getTabsContainer() {
    const { playlist } = this.state;

    return (
      <Tabs>
        <Tabs.TabPane tab="歌曲列表" key="1">
          <MusicList playlist={playlist}></MusicList>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`评论 (${playlist.commentCount})`} key="2">
          <PlayListCommentList id={playlist.id}></PlayListCommentList>
        </Tabs.TabPane>
        <Tabs.TabPane tab="收藏者" key="3">
          <CollectorList
            id={playlist.id}
            count={playlist.subscribedCount}
          ></CollectorList>
        </Tabs.TabPane>
      </Tabs>
    );
  }

  private getSongListDetail() {
    const { id } = this.props;
    this.playListService
      .getPlayListDetail(new RequestParams({ id }))
      .subscribe(({ playlist }) => {
        this.setState({ playlist });
      });
  }
}

export default function() {
  const { id } = useParams();
  return <SongList id={id}></SongList>;
}
