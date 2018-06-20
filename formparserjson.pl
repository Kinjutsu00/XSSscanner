#!/usr/bin/env perl
#
# formfind.pl
#
# This script gets a HTML page on stdin and presents form information on
# stdout.
#
# Author: Daniel Stenberg <daniel@haxx.se>, Mohamed Ouad <mohamed àt ouad d0t it>
# Version: 0.2  Nov 18, 2002
# Update:  1.0  09/2017
#
# HISTORY
#
# 0.1 - Nov 12 1998 - Created now!
# 0.2 - Nov 18 2002 - Enhanced. Removed URL support, use only stdin.
# 1.0 - 09/2017 - You can export result in json format
#
my %perl_data;
my $json = JSON->new;
my $num = 0;
my $num_field = 0;
my $data_to_json;
$in="";

if($ARGV[0] eq "-h") {
    #print  "Usage: $0 < HTML\n";
    exit;
}


sub namevalue {
    my ($tag)=@_;
    my $name=$tag;
    if($name =~ /name *=/i) {
        if($name =~ /name *= *([^\"\']([^ \">]*))/i) {
            $name = $1;
        }
        elsif($name =~ /name *= *(\"|\')([^\"\']*)(\"|\')/i) {
            $name=$2;
        }
        else {
            # there is a tag but we didn't find the contents
            $name="[weird]";
        }

    }
    else {
        # no name given
        $name="";
    }


    # get value tag
    my $value= $tag;
    if($value =~ /[^\.a-zA-Z0-9]value *=/i) {
        if($value =~ /[^\.a-zA-Z0-9]value *= *([^\"\']([^ \">]*))/i) {
            $value = $1;
        }
        elsif($value =~ /[^\.a-zA-Z0-9]value *= *(\"|\')([^\"\']*)(\"|\')/i) {
            $value=$2;
        }
        else {
            # there is a tag but we didn't find the contents
            $value="[weird]";
        }
    }
    else {
        $value="";
    }
    #print "RITORNO: $name -- $value\n";
    return ($name, $value);
}


while(<STDIN>) {
    $line = $_;
    push @indoc, $line;
    $line=~ s/\n//g;
    $line=~ s/\r//g;
    $in=$in.$line;
}

while($in =~ /[^<]*(<[^>]+>)/g ) {
    # we have a tag in $1
    $tag = $1;

    if($tag =~ /^<!--/) {
        # this is a comment tag, ignore it
    }
    else {
        if(!$form &&
           ($tag =~ /^< *form/i )) {
            $method= $tag;
            if($method =~ /method *=/i) {
                $method=~ s/.*method *= *(\"|)([^ \">]*).*/$2/gi;
            }
            else {
                $method="get"; # default method
            }
            $action= $tag;
            $action=~ s/.*action *= *(\'|\"|)([^ \"\'>]*).*/$2/gi;
            $num = $num + 1;
            $num_field = 0;
            $method=uc($method);
            $perl_data{form . $num} = {_metodo=> $method, _action => $action};
            $enctype=$tag;
            if ($enctype =~ /enctype *=/) {
                $enctype=~ s/.*enctype *= *(\'|\"|)([^ \"\'>]*).*/$2/gi;
                $perl_data{form . $num} = {_metodo=> $method, _action => $action, _codifica => $enctype};

                if($enctype eq "multipart/form-data") {
                    $enctype="multipart form upload"
                }

                $enctype = "\n--- type: $enctype";

            }
            else {
                $enctype="";
            }

            #print "--- FORM report. Uses $method to URL \"$action\"$enctype\n";
            $form=1;
        }
        elsif($form &&
              ($tag =~ /< *\/form/i )) {

            #print "--- end of FORM\n";
            $form=0;
            if( 0 ) {
                #print "*** Fill in all or any of these: (default assigns may be shown)\n";
                for(@vars) {
                    $var = $_;
                    $def = $value{$var};
                    #print "$var=$def\n";
                }
                #print "*** Pick one of these:\n";
                for(@alts) {
                    #print "$_\n";
                }
            }
            undef @vars;
            undef @alts;
        }
        elsif($form &&
              ($tag =~ /^< *(input|select)/i)) {
            $mtag = $1;
            #incremento numero del campo
            $num_field = $num_field + 1;
            ($name, $value)=namevalue($tag);
            $perl_data{form . $num}{filed . $num_field} = {name_field => $name, valore => $value};
            #$num_field = $num_field + 1;
            if($mtag =~ /select/i) {
                #print "Select: NAME=\"$name\"\n";
                push @vars, "$name";
                $select = 1;
                $perl_data{form . $num}{filed . $num_field}{tipo_campo} = "select";
            }
            else {
                $type=$tag;
                $type1 = $type;
                $type2 = $type;
                if($type =~ /type *=/i) {
                    $type =~ s/.*type *= *(\'|\"|)([^ \"\'>]*).*/$2/gi;
                }
                else {
                    $type="text"; # default type
                }
                $type=uc($type);
                $perl_data{form . $num}{filed . $num_field}{tipo_campo} = $type;

                ############################################
                # CONTROLLO PRESENZA ATTIB maxlength
                ############################################
                if($type1 =~ /[^\.a-zA-Z0-9]maxlength *=/i) {
                    if($type1 =~ /[^\.a-zA-Z0-9]maxlength *= *([^\"\']([^ \">]*))/i) {
                        $type1 = $1;
                    }
                    elsif($type1 =~ /[^\.a-zA-Z0-9]maxlength *= *(\"|\')([^\"\']*)(\"|\')/i) {
                        $type1=$2;
                    }
                    $perl_data{form . $num}{filed . $num_field}{maxlength} = $type1;
                }

                ############################################
                # CONTROLLO PRESENZA ATTIB placeholder
                ############################################
                if($type2 =~ /[^\.a-zA-Z0-9]placeholder *=/i) {
                    if($type2 =~ /[^\.a-zA-Z0-9]placeholder *= *([^\"\']([^ \">]*))/i) {
                        $type2 = $1;
                    }
                    elsif($type2 =~ /[^\.a-zA-Z0-9]placeholder *= *(\"|\')([^\"\']*)(\"|\')/i) {
                        $type2=$2;
                    }
                    $perl_data{form . $num}{filed . $num_field}{placeholder} = $type2;
                }

                if(lc($type) eq "reset") {
                    # reset types are for UI only, ignore.
                }
                elsif($name eq "") {
                    # let's read the value parameter
                    if($type eq "submit" || $type eq "SUBMIT"){
                      #print "suuuuubmiiiittt: $type \n";
                      #print "Button: \"$value\" ($type)\n";
                    }
                    #print "Button: \"$value\" ($type)\n";
                    #push @alts, "$value";
                }
                else {
                    #print "Input: NAME=\"$name\"";

                    if($value ne "") {
                         #print " VALUE=\"$value\"";
                    }

                    #print " ($type)\n";
                    push @vars, "$name";
                    # store default value:
                    $value{$name}=$value;
                }
            }
        }
        elsif($form &&
              ($tag =~ /^< *textarea/i)) {
            my ($name, $value)=namevalue($tag);
            $num_field = $num_field + 1;
            $perl_data{form . $num}{filed . $num_field} = {name_field => $name, tipo_campo => 'textarea'};

            #print "Textarea: NAME=\"$name\"\n";
        }
        elsif($select) {
            if($tag =~ /^< *\/ *select/i) {
                #print "[end of select]\n";
                $select = 0;
            }
            elsif($tag =~ /[^\/] *option/i ) {
                my ($name, $value)=namevalue($tag);
                my $s;
                if($tag =~ /selected/i) {
                    $s= " (SELECTED)";
                }
                #print "  Option VALUE=\"$value\"$s\n";
            }
        }
    }
}
use strict;
use warnings;
use JSON;



print $json->pretty->encode(\%perl_data) . "\n";
print "\n";
