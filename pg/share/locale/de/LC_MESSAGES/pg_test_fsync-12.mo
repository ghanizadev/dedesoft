��            )   �      �  1   �  2   �  /        6  8   Q     �     �     �     �     �  (        >  4   F  U   {  [   �  K   -  c   y     �  "   �  .     E   J  &   �  +   �     �     �                       �  -  F   �  K   �  <   H	  %   �	  @   �	     �	     

     (
     F
     d
  *   �
     �
  <   �
  k   �
  h   _  S   �  k        �  (   �  9   �  R   	  8   \  ,   �  !   �     �     �     �                                                                   	                                     
                                           
Compare file sync methods using one %dkB write:
 
Compare file sync methods using two %dkB writes:
 
Compare open_sync with different write sizes:
 
Non-sync'ed %dkB writes:
 
Test if fsync on non-write file descriptor is honored:
  1 * 16kB open_sync write  2 *  8kB open_sync writes  4 *  4kB open_sync writes  8 *  2kB open_sync writes %13.3f ops/sec  %6.0f usecs/op
 %d second per test
 %d seconds per test
 %s: %s
 %s: too many command-line arguments (first is "%s")
 (If the times are similar, fsync() can sync data written on a different
descriptor.)
 (This is designed to compare the cost of writing 16kB in different write
open_sync sizes.)
 (in wal_sync_method preference order, except fdatasync is Linux's default)
 * This file system and its mount options do not support direct
  I/O, e.g. ext4 in journaled mode.
 16 *  1kB open_sync writes Could not create thread for alarm
 Direct I/O is not supported on this platform.
 O_DIRECT supported on this platform for open_datasync and open_sync.
 Try "%s --help" for more information.
 Usage: %s [-f FILENAME] [-s SECS-PER-TEST]
 could not open output file fsync failed n/a n/a* seek failed write failed Project-Id-Version: pg_test_fsync (PostgreSQL) 10
Report-Msgid-Bugs-To: pgsql-bugs@postgresql.org
PO-Revision-Date: 2017-08-26 12:30-0400
Last-Translator: Peter Eisentraut <peter_e@gmx.net>
Language-Team: German <pgsql-translators@postgresql.org>
Language: de
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
Plural-Forms: nplurals=2; plural=n != 1;
 
Vergleich von Datei-Sync-Methoden bei einem Schreibvorgang aus %dkB:
 
Vergleich von Datei-Sync-Methoden bei zwei Schreibvorgängen aus je %dkB:
 
Vergleich von open_sync mit verschiedenen Schreibgrößen:
 
Nicht gesynctes Schreiben von %dkB:
 
Probe ob fsync auf einem anderen Dateideskriptor funktioniert:
  1 * 16kB open_sync schreiben  2 *  8kB open_sync schreiben  4 *  4kB open_sync schreiben  8 *  2kB open_sync schreiben   %13.3f Op./s  %6.0f µs/Op.
 %d Sekunde pro Test
 %d Sekunden pro Test
 %s: %s
 %s: zu viele Kommandozeilenargumente (das erste ist »%s«)
 (Wenn die Zeiten ähnlich sind, dann kann fsync() auf einem anderen Deskriptor
geschriebene Daten syncen.)
 (Damit werden die Kosten für das Schreiben von 16kB in verschieden Größen mit
open_sync verglichen.)
 (in Rangordnung von wal_sync_method, außer dass fdatasync auf Linux Standard ist)
 * Dieses Dateisystem und die Mount-Optionen unterstützen kein Direct-I/O,
  z.B. ext4 im Journaled-Modus.
 16 *  1kB open_sync schreiben Konnte Thread für Alarm nicht erzeugen
 Direct-I/O wird auf dieser Plattform nicht unterstützt.
 O_DIRECT wird auf dieser Plattform für open_datasync und open_sync unterstützt.
 Versuchen Sie »%s --help« für weitere Informationen.
 Aufruf: %s [-f DATEINAME] [-s SEK-PRO-TEST]
 konnte Ausgabedatei nicht öffnen fsync fehlgeschlagen entf. entf.* seek fehlgeschlagen Schreiben fehlgeschlagen 