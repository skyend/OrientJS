
# find -name *.html | perl OrientOrbitMigrator.pl


use strict;
use 5.010;

use constant true => 1;
use constant false => 0;

say "hello";

my $filename = 'package.json';

processing($filename);

sub processing {
  my $filename = shift;
  my @lines = readFile($filename);

  my @modifiedLines = modify(@lines);

  #say @lines;
}

sub readFile {
  my $filename = shift;
  my @lines = ();

  if (open(my $fh, '<:encoding(UTF-8)', $filename)) {
    while (my $row = <$fh>) {
      #chomp $row;
      #print "$row\n";

      push @lines, $row;
    }
  } else {
    warn "Could not open file '$filename' $!";
  }

  return @lines;
}

sub modify {
  my @lines = @_;

  my $startHead = false;

  # 1. Head 세팅
  # 2. fragment 연결
  # 3. APISource 연결

  for my $line (@lines) {

  }
}
