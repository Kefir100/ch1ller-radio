import * as fs from 'fs';
import * as _ from 'highland';
import * as id3 from 'node-id3';
import { Readable } from 'stream';
import { extractLast } from '../../utils/funcs';
import { getDateFromMsecs } from '../../utils/time';
import * as Mp3 from '../../utils/mp3';
import type { ShallowTrackMeta, TrackPath, TrackStats } from '../../types/Track.h';

const getMetaAsync = async (stats: TrackStats): Promise<ShallowTrackMeta> => {
  const { fullPath, name } = stats;

  return new Promise(
    (res) => id3.read(fullPath, (err, meta) => {
      const { artist, title, ...rest } = meta || {};

      if (!artist || !title || err) {
        const calculated = name.split(' - ');
        res({ artist: calculated[0], title: calculated[1], origin: 'fs' });
      }
      res({
        artist, title, ...rest, origin: 'id3',
      });
    }),
  );
};

const getStats = (fullPath: TrackPath) => {
  const file = fs.readFileSync(fullPath);
  const [directory, fullName] = extractLast(fullPath, '/');
  const duration = Mp3.getDuration(file);
  const tagsSize = Mp3.getTagsSize(file);
  const { size } = fs.statSync(fullPath);
  const [name, format] = extractLast(fullName, '.');

  return {
    size,
    tagsSize,
    directory,
    duration,
    format,
    fullPath,
    name,
    bitrate: Math.ceil((size - tagsSize) / (duration / 1000)),
    stringified: `${name}.${format} [${Math.floor(size / 1024) / 1000}MB/${getDateFromMsecs(duration)}]`,
  };
};

const createSoundStream = ({ fullPath, bitrate, tagsSize }: TrackStats): Readable => {
  try {
    const rs = _(fs.createReadStream(fullPath, { highWaterMark: bitrate }));
    const comp = _.seq(
      _.drop(Math.floor(tagsSize / bitrate)), // remove id3tags from stream
      _.ratelimit(1, 1000),
    );

    return comp(rs);
  } catch (e) {
    // skip track if it is not accessible
    return _(new Array(0));
  }
};

export {
  createSoundStream,
  getMetaAsync,
  getStats,
};
