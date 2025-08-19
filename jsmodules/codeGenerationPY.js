const code = {
    0: `from __future__ import unicode_literals
__license__ = 'Public Domain'
import io
import os
import random
import sys
from .options import (
    parseOpts,
)
from .compat import (
    compat_getpass,
    compat_register_utf8,
    compat_shlex_split,
    _workaround_optparse_bug9161,
)
from .utils import (
    _UnsafeExtensionError,
    DateRange,
    decodeOption,
    DEFAULT_OUTTMPL,
    DownloadError,
    expand_path,
    match_filter_func,
    MaxDownloadsReached,
    preferredencoding,
    read_batch_urls,
    SameFileError,
    setproctitle,
    std_headers,
    write_string,
    render_table,
)
from .update import update_self
from .downloader import (
    FileDownloader,
)
from .extractor import gen_extractors, list_extractors
from .extractor.adobepass import MSO_INFO
from .YoutubeDL import YoutubeDL
def _real_main(argv=None):
    # Compatibility fix for Windows
    compat_register_utf8()
    _workaround_optparse_bug9161()
    setproctitle('youtube-dl')
    parser, opts, args = parseOpts(argv)
    # Set user agent
    if opts.user_agent is not None:
        std_headers['User-Agent'] = opts.user_agent
    # Set referer
    if opts.referer is not None:
        std_headers['Referer'] = opts.referer
    # Custom HTTP headers
    if opts.headers is not None:
        for h in opts.headers:
            if ':' not in h:
                parser.error('wrong header formatting, it should be key:value, not "%s"' % h)
            key, value = h.split(':', 1)
            if opts.verbose:
                write_string('[debug] Adding header from command line option %s:%s\n' % (key, value))
            std_headers[key] = value
    # Dump user agent
    if opts.dump_user_agent:
        write_string(std_headers['User-Agent'] + '\n', out=sys.stdout)
        sys.exit(0)`,
    1: ` batch_urls = []
    if opts.batchfile is not None:
        try:
            if opts.batchfile == '-':
                batchfd = sys.stdin
            else:
                batchfd = io.open(
                    expand_path(opts.batchfile),
                    'r', encoding='utf-8', errors='ignore')
            batch_urls = read_batch_urls(batchfd)
            if opts.verbose:
                write_string('[debug] Batch file urls: ' + repr(batch_urls) + '\n')
        except IOError:
            sys.exit('ERROR: batch file %s could not be read' % opts.batchfile)
    all_urls = batch_urls + [url.strip() for url in args]  # batch_urls are already striped in read_batch_urls
    _enc = preferredencoding()
    all_urls = [url.decode(_enc, 'ignore') if isinstance(url, bytes) else url for url in all_urls]
    if opts.list_extractors:
        for ie in list_extractors(opts.age_limit):
            write_string(ie.IE_NAME + (' (CURRENTLY BROKEN)' if not ie._WORKING else '') + '\n', out=sys.stdout)
            matchedUrls = [url for url in all_urls if ie.suitable(url)]
            for mu in matchedUrls:
                write_string('  ' + mu + '\n', out=sys.stdout)
        sys.exit(0)
    if opts.list_extractor_descriptions:
        for ie in list_extractors(opts.age_limit):
            if not ie._WORKING:
                continue
            desc = getattr(ie, 'IE_DESC', ie.IE_NAME)
            if desc is False:
                continue
            if hasattr(ie, 'SEARCH_KEY'):
                _SEARCHES = ('cute kittens', 'slithering pythons', 'falling cat', 'angry poodle', 'purple fish', 'running tortoise', 'sleeping bunny', 'burping cow')
                _COUNTS = ('', '5', '10', 'all')
                desc += ' (Example: "%s%s:%s" )' % (ie.SEARCH_KEY, random.choice(_COUNTS), random.choice(_SEARCHES))
            write_string(desc + '\n', out=sys.stdout)
        sys.exit(0)
    if opts.ap_list_mso:
        table = [[mso_id, mso_info['name']] for mso_id, mso_info in MSO_INFO.items()]
        write_string('Supported TV Providers:\n' + render_table(['mso', 'mso name'], table) + '\n', out=sys.stdout)
        sys.exit(0)
    # Conflicting, missing and erroneous options
    if opts.usenetrc and (opts.username is not None or opts.password is not None):
        parser.error('using .netrc conflicts with giving username/password')
    if opts.password is not None and opts.username is None:
        parser.error('account username missing\n')
    if opts.ap_password is not None and opts.ap_username is None:
        parser.error('TV Provider account username missing\n')
    if opts.outtmpl is not None and (opts.usetitle or opts.autonumber or opts.useid):
        parser.error('using output template conflicts with using title, video ID or auto number')
    if opts.autonumber_size is not None:
        if opts.autonumber_size <= 0:
            parser.error('auto number size must be positive')
    if opts.autonumber_start is not None:
        if opts.autonumber_start < 0:
            parser.error('auto number start must be positive or 0')
    if opts.usetitle and opts.useid:
        parser.error('using title conflicts with using video ID')
    if opts.username is not None and opts.password is None:
        opts.password = compat_getpass('Type account password and press [Return]: ')
    if opts.ap_username is not None and opts.ap_password is None:
        opts.ap_password = compat_getpass('Type TV provider account password and press [Return]: ')
    if opts.ratelimit is not None:
        numeric_limit = FileDownloader.parse_bytes(opts.ratelimit)
        if numeric_limit is None:
            parser.error('invalid rate limit specified')
        opts.ratelimit = numeric_limit
    if opts.min_filesize is not None:
        numeric_limit = FileDownloader.parse_bytes(opts.min_filesize)
        if numeric_limit is None:
            parser.error('invalid min_filesize specified')
        opts.min_filesize = numeric_limit
    if opts.max_filesize is not None:
        numeric_limit = FileDownloader.parse_bytes(opts.max_filesize)
        if numeric_limit is None:
            parser.error('invalid max_filesize specified')
        opts.max_filesize = numeric_limit
    if opts.sleep_interval is not None:
        if opts.sleep_interval < 0:
            parser.error('sleep interval must be positive or 0')
    if opts.max_sleep_interval is not None:
        if opts.max_sleep_interval < 0:
            parser.error('max sleep interval must be positive or 0')
        if opts.sleep_interval is None:
            parser.error('min sleep interval must be specified, use --min-sleep-interval')
        if opts.max_sleep_interval < opts.sleep_interval:
            parser.error('max sleep interval must be greater than or equal to min sleep interval')
    else:
        opts.max_sleep_interval = opts.sleep_interval
    if opts.ap_mso and opts.ap_mso not in MSO_INFO:
        parser.error('Unsupported TV Provider, use --ap-list-mso to get a list of supported TV Providers')

    if opts.no_check_extensions:
        _UnsafeExtensionError.lenient = True

    def parse_retries(retries):
        if retries in ('inf', 'infinite'):
            parsed_retries = float('inf')
        else:
            try:
                parsed_retries = int(retries)
            except (TypeError, ValueError): `,

    2: ` # coding: utf-8
from __future__ import unicode_literals

import errno
import json
import os
import re
import shutil
import traceback

from .compat import (
    compat_getenv,
    compat_open as open,
    compat_os_makedirs,
)
from .utils import (
    error_to_compat_str,
    escape_rfc3986,
    expand_path,
    is_outdated_version,
    traverse_obj,
    write_json_file,
)
from .version import __version__


class Cache(object):
    _YTDL_DIR = 'youtube-dl'
    _VERSION_KEY = _YTDL_DIR + '_version'
    _DEFAULT_VERSION = '2021.12.17'
    def __init__(self, ydl):
        self._ydl = ydl
    def _write_debug(self, *args, **kwargs):
        self._ydl.write_debug(*args, **kwargs)
    def _report_warning(self, *args, **kwargs):
        self._ydl.report_warning(*args, **kwargs)
    def _to_screen(self, *args, **kwargs):
        self._ydl.to_screen(*args, **kwargs)
    def _get_param(self, k, default=None):
        return self._ydl.params.get(k, default)
    def _get_root_dir(self):
        res = self._get_param('cachedir')
        if res is None:
            cache_root = compat_getenv('XDG_CACHE_HOME', '~/.cache')
            res = os.path.join(cache_root, self._YTDL_DIR)
        return expand_path(res)
    def _get_cache_fn(self, section, key, dtype):
        assert re.match(r'^[\w.-]+$', section), \
            'invalid section %r' % section
        key = escape_rfc3986(key, safe='').replace('%', ',')  # encode non-ascii characters
        return os.path.join(
            self._get_root_dir(), section, '%s.%s' % (key, dtype))
    @property
    def enabled(self):
        return self._get_param('cachedir') is not False
    def store(self, section, key, data, dtype='json'):
        assert dtype in ('json',)
        if not self.enabled:
            return
        fn = self._get_cache_fn(section, key, dtype)
        try:
            compat_os_makedirs(os.path.dirname(fn), exist_ok=True)
            self._write_debug('Saving {section}.{key} to cache'.format(section=section, key=key))
            write_json_file({self._VERSION_KEY: __version__, 'data': data}, fn)
        except Exception:
            tb = traceback.format_exc()
            self._report_warning('Writing cache to {fn!r} failed: {tb}'.format(fn=fn, tb=tb))
    def clear(self, section, key, dtype='json'):
        if not self.enabled:
            return
        fn = self._get_cache_fn(section, key, dtype)
        self._write_debug('Clearing {section}.{key} from cache'.format(section=section, key=key))
        try:
            os.remove(fn)
        except Exception as e:
            if getattr(e, 'errno') == errno.ENOENT:
                # file not found
                return
            tb = traceback.format_exc()
            self._report_warning('Clearing cache from {fn!r} failed: {tb}'.format(fn=fn, tb=tb))
    def _validate(self, data, min_ver):
        version = traverse_obj(data, self._VERSION_KEY)
        if not version:  # Backward compatibility
            data, version = {'data': data}, self._DEFAULT_VERSION
        if not is_outdated_version(version, min_ver or '0', assume_new=False):
            return data['data']
        self._write_debug('Discarding old cache from version {version} (needs {min_ver})'.format(version=version, min_ver=min_ver))
    def load(self, section, key, dtype='json', default=None, **kw_min_ver):
        assert dtype in ('json',)
        min_ver = kw_min_ver.get('min_ver')
        if not self.enabled:
            return default
        cache_fn = self._get_cache_fn(section, key, dtype)
        try:
            with open(cache_fn, encoding='utf-8') as cachef:
                self._write_debug('Loading {section}.{key} from cache'.format(section=section, key=key), only_once=True)
                return self._validate(json.load(cachef), min_ver)
        except (ValueError, KeyError):
            try:
                file_size = 'size: %d' % os.path.getsize(cache_fn)
            except (OSError, IOError) as oe:
                file_size = error_to_compat_str(oe)
            self._report_warning('Cache retrieval from %s failed (%s)' % (cache_fn, file_size))
        except Exception as e:
            if getattr(e, 'errno') == errno.ENOENT:
                # no cache available
                return
            self._report_warning('Cache retrieval from %s failed' % (cache_fn,))
        return default
    def remove(self):
        if not self.enabled:
            self._to_screen('Cache is disabled (Did you combine --no-cache-dir and --rm-cache-dir?)')
            return
        cachedir = self._get_root_dir()
        if not any((term in cachedir) for term in ('cache', 'tmp')):
            raise Exception('Not removing directory %s - this does not look like a cache dir' % (cachedir,))
        self._to_screen(
            'Removing cache dir %s .' % (cachedir,), skip_eol=True, ),
        if os.path.exists(cachedir):
            self._to_screen('.', skip_eol=True)
            shutil.rmtree(cachedir)
        self._to_screen('.')`

};
function random(number) {
    return Math.trunc(Math.random() * number);
}

const randomNumber = random(2);
const randomCodeC = code[randomNumber];

export { randomCodeC };
