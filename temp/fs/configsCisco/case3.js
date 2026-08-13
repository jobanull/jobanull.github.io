export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/ciscolsp.png" alt="contoh gambar case 0">
<span class="cmd-green">
# ================================
# PE 1 CONFIGURATION
# ================================
</span>
hostname PE1

mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
mpls traffic-eng tunnels
mpls traffic-eng reoptimize timers frequency 300

interface Tunnel1
 description TE_TUNNEL_TO_PE2
 ip unnumbered Loopback0
 tunnel mode mpls traffic-eng
 tunnel destination 4.4.4.4
 tunnel mpls traffic-eng autoroute announce
 tunnel mpls traffic-eng path-option 1 explicit name PATH_PE1_TO_PE2
 tunnel mpls traffic-eng path-option 10 dynamic
!

pseudowire-class LSP
 encapsulation mpls
 preferred-path interface Tunnel1

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0010.0100.1001.00
 is-type level-2-only
 metric-style wide
 mpls traffic-eng router-id Loopback0
 mpls traffic-eng level-2

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 10.10.10.1 255.255.255.252
 description P1-Gi1
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface GigabitEthernet2
 no shut
 ip address 11.11.11.1 255.255.255.252
 description P2-E1/0/0
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface GigabitEthernet3
 no shut
 no ip address
 description SW1
 mpls ip
 mtu 1508
 xconnect 4.4.4.4 200 encapsulation mpls pw-class LSP

interface Loopback0
 ip address 1.1.1.1 255.255.255.255
 ip router isis CORE

<span class="cmd-green">
# ================================
# P1 CONFIGURATION
# ================================
</span>
hostname P1

mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
mpls traffic-eng tunnels

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0020.0200.2002.00
 is-type level-2-only
 metric-style wide
 mpls traffic-eng router-id Loopback0
 mpls traffic-eng level-2

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 10.10.10.2 255.255.255.252
 description PE1-Gi1
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface GigabitEthernet2
 no shut
 ip address 12.12.12.1 255.255.255.252
 description PE2-Gi1
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface Loopback0
 ip address 2.2.2.2 255.255.255.255
 ip router isis CORE

<span class="cmd-green">
# ================================
# P2 CONFIGURATION
# ================================
</span>
sysname P2

mpls lsr-id 3.3.3.3
mpls
mpls l2vpn
mpls ldp
mpls te
mpls rsvp

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 network-entity 49.0001.0030.0300.3003.00
 traffic-eng level-2

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 undo shutdown
 ip address 11.11.11.2 255.255.255.252
 description PE1-Gi1
 isis enable 1
 mpls
 mpls ldp
 mpls te
 mpls rsvp

interface Ethernet1/0/1
 undo shutdown
 ip address 13.13.13.1 255.255.255.252
 description PE2-Gi2
 isis enable 1
 mpls
 mpls ldp
 mpls te
 mpls rsvp

interface LoopBack0
 ip address 3.3.3.3 255.255.255.255
 isis enable 1

<span class="cmd-green">
# ================================
# PE2 CONFIGURATION
# ================================
</span>
hostname PE2

mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
mpls traffic-eng tunnels

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0040.0400.4004.00
 is-type level-2-only
 metric-style wide
 mpls traffic-eng router-id Loopback0
 mpls traffic-eng level-2

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 12.12.12.2 255.255.255.252
 description PE1-Gi2
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface GigabitEthernet2
 no shut
 ip address 13.13.13.2 255.255.255.252
 description P2-E1/0/1
 ip router isis CORE
 mpls ip
 mpls traffic-eng tunnels
 ip rsvp bandwidth 100000 100000

interface GigabitEthernet3
 no shut
 description SW2
 ip router isis CORE
 mpls ip
 mtu 1508
 xconnect 1.1.1.1 200 encapsulation mpls

interface Loopback0
 ip address 4.4.4.4 255.255.255.255
 ip router isis CORE

<span class="cmd-green">
# ================================
# SW 1 CONFIGURATION
# ================================
</span>
hostname SW1
vlan 200
 name TEST
exit
interface gi0/0
 switchport mode trunk
 switchport trunk allowed vlan only 200
interface gi0/1
 switchport mode access
 switchport access vlan 200

<span class="cmd-green">
# ================================
# SW 2 CONFIGURATION
# ================================
</span>
hostname SW2
vlan 200
 name TEST
exit
interface gi0/0
 switchport mode trunk
 switchport trunk allowed vlan only 200
interface gi0/1
 switchport mode access
 switchport access vlan 200
  
<span class="cmd-green">
# ================================
# VERIFICATION
# ================================
</span>
PE1#show mpls l2transport vc 200

Local intf     Local circuit              Dest address    VC ID      Status
-------------  -------------------------- --------------- ---------- ----------
Gi3            Ethernet                   4.4.4.4         200        UP       

PE1#traceroute mpls traffic-eng tunnel 1

PE1#show mpls l2transport vc 200

Local intf     Local circuit              Dest address    VC ID      Status
-------------  -------------------------- --------------- ---------- ----------
Gi3            Ethernet                   4.4.4.4         200        UP       

PE1#traceroute mpls traffic-eng tunnel 1

Type escape sequence to abort.
  0 11.11.11.1 MRU 1500 [Labels: 48135 Exp: 0]
L 1 11.11.11.2 MRU 1500 [Labels: implicit-null Exp: 0] 5 ms
! 2 13.13.13.2 8 ms

PE1#

PC1> sh ip           

NAME        : PC1[1]
IP/MASK     : 192.168.1.1/30

PC1> ping 192.168.1.2

84 bytes from 192.168.1.2 icmp_seq=1 ttl=64 time=4.786 ms
84 bytes from 192.168.1.2 icmp_seq=2 ttl=64 time=5.213 ms
84 bytes from 192.168.1.2 icmp_seq=3 ttl=64 time=4.674 ms
84 bytes from 192.168.1.2 icmp_seq=4 ttl=64 time=82.344 ms
84 bytes from 192.168.1.2 icmp_seq=5 ttl=64 time=89.115 ms
`;