export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l2vpnhw.png">

<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
sysname PE1
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 1.1.1.1

mpls
mpls l2vpn
mpls ldp
 ipv4-family

mpls ldp remote-peer PE2
 remote-ip 4.4.4.4

mpls ldp remote-peer PE3
 remote-ip 6.6.6.6
<span class="cmd-bold">
# ================================
# VSI / VPLS CONFIGURATION
# ================================
</span>
vsi VPLS-CE
 pwsignal ldp
  vsi-id 100
  peer 4.4.4.4
  peer 6.6.6.6
 mtu 1530
 encapsulation ethernet

vsi 100200
 pwsignal ldp
  vsi-id 200
  peer 4.4.4.4
 mtu 1530
 encapsulation ethernet
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0010.0100.1001.00

<span class="cmd-bold">
# ================================
# ETH-TRUNK CONFIGURATION
# ================================
</span>
interface Eth-Trunk1
 ip address 10.10.10.2 30
 description P1-Eth-Trunk1
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 portswitch
 port link-type trunk
<span class="cmd-bold">
# ================================
# SUB-INTERFACE VPLS CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0.100
 description PC1
 vlan-type dot1q 100
 l2 binding vsi VPLS-CE

interface Ethernet1/0/0.200
 description PC2
 vlan-type dot1q 200
 l2 binding vsi 100200
<span class="cmd-bold">
# ================================
# MEMBER INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/2
 description P1-Ethernet1/0/2
 eth-trunk 1

interface Ethernet1/0/3
 description P1-Ethernet1/0/3
 eth-trunk 1
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 1.1.1.1 32
 isis enable 1
<span class="cmd-green">
# ================================
# P1 CONFIGURATION 
# ================================
</span>
sysname P1
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 2.2.2.2

mpls

mpls ldp
 ipv4-family
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0020.0200.2002.00
<span class="cmd-bold">
# ================================
# ETH-TRUNK 1 CONFIGURATION
# ================================
</span>
interface Eth-Trunk1
 ip address 10.10.10.1 30
 description PE1-Eth-Trunk1
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# ETH-TRUNK 2 CONFIGURATION
# ================================
</span>
interface Eth-Trunk2
 ip address 11.11.11.1 30
 description P2-Eth-Trunk2
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# MEMBER INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 description P2-Ethernet1/0/0
 eth-trunk 2

interface Ethernet1/0/1
 description P2-Ethernet1/0/1
 eth-trunk 2

interface Ethernet1/0/2
 description PE1-Ethernet1/0/2
 eth-trunk 1

interface Ethernet1/0/3
 description PE1-Ethernet1/0/3
 eth-trunk 1
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 2.2.2.2 32
 isis enable 1
<span class="cmd-green">
# ================================
#  CONFIGURATION P2
# ================================
</span>
sysname P2
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 3.3.3.3

mpls
mpls ldp
 ipv4-family
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0030.0300.3003.00
<span class="cmd-bold">
# ================================
# ETH-TRUNK 1 CONFIGURATION
# ================================
</span>
interface Eth-Trunk1
 ip address 12.12.12.1 30
 description PE2-Eth-Trunk1
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# ETH-TRUNK 2 CONFIGURATION
# ================================
</span>
interface Eth-Trunk2
 ip address 11.11.11.2 30
 description P1-Eth-Trunk2
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# MEMBER INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 description P1-Ethernet1/0/0
 eth-trunk 2

interface Ethernet1/0/1
 description P1-Ethernet1/0/0
 eth-trunk 2

interface Ethernet1/0/2
 description PE2-Ethernet1/0/2
 eth-trunk 1

interface Ethernet1/0/3
 description PE2-Ethernet1/0/3
 eth-trunk 1
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/4
 description P3-Ethernet1/0/0
 undo shutdown
 ip address 13.13.13.1 30
 isis enable 1
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 3.3.3.3 32
 isis enable 1
<span class="cmd-green">
# ================================
# PE2 CONFIGURATION 
# ================================
</span>
sysname PE2
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 4.4.4.4

mpls
mpls l2vpn
mpls ldp
 ipv4-family

mpls ldp remote-peer PE1
 remote-ip 1.1.1.1

mpls ldp remote-peer PE3
 remote-ip 6.6.6.6
<span class="cmd-bold">
# ================================
# VSI / VPLS CONFIGURATION
# ================================
</span>
vsi VPLS-CE
 pwsignal ldp
  vsi-id 100
  peer 1.1.1.1
  peer 6.6.6.6
 mtu 1530
 encapsulation ethernet

vsi 100200
 pwsignal ldp
  vsi-id 200
  peer 1.1.1.1
 mtu 1530
 encapsulation ethernet
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0040.0400.4004.00
<span class="cmd-bold">
# ================================
# ETH-TRUNK CONFIGURATION
# ================================
</span>
interface Eth-Trunk1
 ip address 12.12.12.2 30
 description P2-Eth-Trunk1
 isis enable 1
 mode lacp-static
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 portswitch
 port link-type trunk
<span class="cmd-bold">
# ================================
# SUB-INTERFACE VPLS CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0.100
 description PC3
 vlan-type dot1q 100
 l2 binding vsi VPLS-CE

interface Ethernet1/0/0.200
 description PC4
 vlan-type dot1q 200
 l2 binding vsi 100200
<span class="cmd-bold">
# ================================
# MEMBER INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/2
 description P2-Eth-Trunk1
 eth-trunk 1

interface Ethernet1/0/3
 description P2-Eth-Trunk1
 eth-trunk 1
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 4.4.4.4 32
 isis enable 1
<span class="cmd-green">
# ================================
#  CONFIGURATION P3
# ================================
</span>
sysname P3
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 5.5.5.5
mpls
mpls ldp
 ipv4-family
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0050.0500.5005.00
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 description P2-Ethernet1/0/0
 ip address 13.13.13.2 30
 mpls 
 mpls ldp
 isis enable 1

interface Ethernet1/0/1
 description PE3-Ethernet1/0/1
 ip address 14.14.14.1 30
 mpls 
 mpls ldp
 isis enable 1
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 5.5.5.5 32
 isis enable 1
<span class="cmd-green">
# ================================
# PE3 CONFIGURATION 
# ================================
</span>
sysname PE3
<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 6.6.6.6

mpls
mpls l2vpn
mpls ldp
 ipv4-family

mpls ldp remote-peer PE1
 remote-ip 1.1.1.1
mpls ldp remote-peer PE2
 remote-ip 4.4.4.4
<span class="cmd-bold">
# ================================
# VSI / VPLS CONFIGURATION
# ================================
</span>
vsi VPLS-CE
 pwsignal ldp
  vsi-id 100
  peer 1.1.1.1
  peer 4.4.4.4
 mtu 1530
 encapsulation ethernet
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0060.0600.6006.00
<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 ip address 14.14.14.2 30
 description P3-Ethernet1/0/1
 isis enable 1
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 portswitch
 port link-type trunk
<span class="cmd-bold">
# ================================
# SUB-INTERFACE VPLS CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1.100
 description PC5
 vlan-type dot1q 100
 l2 binding vsi VPLS-CE
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 6.6.6.6 32
 isis enable 1

<span class="cmd-bold">
# SW1, SW2 & SW3
# ================================
# BRIDGE CONFIGURATION
# ================================
</span>
/interface bridge
add name=VLAN vlan-filtering=yes
<span class="cmd-bold">
# ================================
# TRUNK INTERFACE CONFIGURATION
# ================================
</span>
/interface bridge port
add bridge=VLAN interface=ether1
<span class="cmd-bold">
# ================================
# ACCESS INTERFACE VLAN
# ================================
</span>
/interface bridge port
add bridge=VLAN interface=ether2 pvid=100
add bridge=VLAN interface=ether3 pvid=200
<span class="cmd-bold">
# ================================
# VLAN TABLE CONFIGURATION
# ================================
</span>
/interface bridge vlan
add bridge=VLAN vlan-ids=100 tagged=VLAN,ether1 untagged=ether2
add bridge=VLAN vlan-ids=200 tagged=VLAN,ether1 untagged=ether3
<span class="cmd-bold">
# ================================
# VERIFICATION
# ================================
</span>
[~PE1]ping 4.4.4.4
  PING 4.4.4.4: 56  data bytes, press CTRL_C to break
    Reply from 4.4.4.4: bytes=56 Sequence=1 ttl=253 time=17 ms
    Reply from 4.4.4.4: bytes=56 Sequence=2 ttl=253 time=6 ms
    Reply from 4.4.4.4: bytes=56 Sequence=3 ttl=253 time=6 ms
    Reply from 4.4.4.4: bytes=56 Sequence=4 ttl=253 time=8 ms
    Reply from 4.4.4.4: bytes=56 Sequence=5 ttl=253 time=7 ms

  --- 4.4.4.4 ping statistics ---
    5 packet(s) transmitted
    5 packet(s) received
    0.00% packet loss
    round-trip min/avg/max = 6/8/17 ms
 
[~PE1]ping 6.6.6.6
  PING 6.6.6.6: 56  data bytes, press CTRL_C to break
    Reply from 6.6.6.6: bytes=56 Sequence=1 ttl=252 time=19 ms
    Reply from 6.6.6.6: bytes=56 Sequence=2 ttl=252 time=9 ms
    Reply from 6.6.6.6: bytes=56 Sequence=3 ttl=252 time=9 ms
    Reply from 6.6.6.6: bytes=56 Sequence=4 ttl=252 time=10 ms
    Reply from 6.6.6.6: bytes=56 Sequence=5 ttl=252 time=9 ms

  --- 6.6.6.6 ping statistics ---
    5 packet(s) transmitted
    5 packet(s) received
    0.00% packet loss
    round-trip min/avg/max = 9/11/19 ms

[~PE1]display mac-address 
MAC address table of slot 0:
-------------------------------------------------------------------------------
MAC Address    VLAN/BD/    PEVLAN CEVLAN Port/Peerip     Type      LSP/LSR-ID
               VSI/SI/EVPN                                         MAC-Tunnel
-------------------------------------------------------------------------------
0050-7966-6838 VPLS-CE     100    -      Eth1/0/0.100    dynamic   0/0         
0050-7966-6839 VPLS-CE     -      -      Eth-Trunk1      dynamic   0/0         
0050-7966-683a 11200       200    -      Eth1/0/0.200    dynamic   0/0         
0050-7966-683b 11200       -      -      Eth-Trunk1      dynamic   0/1         
-------------------------------------------------------------------------------
Total matching items on slot 0 displayed = 4

[~PE2]display mac-address     
MAC address table of slot 0:
-------------------------------------------------------------------------------
MAC Address    VLAN/BD/    PEVLAN CEVLAN Port/Peerip     Type      LSP/LSR-ID
               VSI/SI/EVPN                                         MAC-Tunnel
-------------------------------------------------------------------------------
0050-7966-6838 VPLS-CE     -      -      Eth-Trunk1      dynamic   0/0         
0050-7966-6839 VPLS-CE     100    -      Eth1/0/0.100    dynamic   0/0         
0050-7966-683a 11200       -      -      Eth-Trunk1      dynamic   0/1         
0050-7966-683b 11200       200    -      Eth1/0/0.200    dynamic   0/0         
-------------------------------------------------------------------------------
Total matching items on slot 0 displayed = 4

[~PE3]display mac-address
MAC address table of slot 0:
-------------------------------------------------------------------------------
MAC Address    VLAN/BD/    PEVLAN CEVLAN Port/Peerip     Type      LSP/LSR-ID
               VSI/SI/EVPN                                         MAC-Tunnel
-------------------------------------------------------------------------------
0050-7966-6838 VPLS-CE     -      -      Eth1/0/0        dynamic   0/0         
0050-7966-6844 VPLS-CE     100    -      Eth1/0/1.100    dynamic   0/0         
-------------------------------------------------------------------------------
Total matching items on slot 0 displayed = 2

MAC address table of slot 1:
-------------------------------------------------------------------------------
MAC Address    VLAN/BD/    PEVLAN CEVLAN Port/Peerip     Type      LSP/LSR-ID
               VSI/SI/EVPN                                         MAC-Tunnel
-------------------------------------------------------------------------------
0050-7966-6838 VPLS-CE     -      -      Eth1/0/0        dynamic   1/0         
0050-7966-6844 VPLS-CE     100    -      Eth1/0/1.100    dynamic   1/0         
-------------------------------------------------------------------------------
Total matching items on slot 1 displayed = 2


PC1> ping 192.168.10.2

84 bytes from 192.168.10.2 icmp_seq=1 ttl=64 time=13.852 ms
84 bytes from 192.168.10.2 icmp_seq=2 ttl=64 time=12.957 ms
84 bytes from 192.168.10.2 icmp_seq=3 ttl=64 time=12.432 ms
84 bytes from 192.168.10.2 icmp_seq=4 ttl=64 time=11.820 ms
84 bytes from 192.168.10.2 icmp_seq=5 ttl=64 time=12.531 ms

VPC1> trace 192.168.10.2 -P 1
trace to 192.168.10.2, 8 hops max (ICMP), press Ctrl+C to stop
 1   192.168.10.2   12.797 ms  9.772 ms  10.686 ms

PC1> ping 192.168.10.3

84 bytes from 192.168.10.2 icmp_seq=1 ttl=64 time=13.852 ms
84 bytes from 192.168.10.2 icmp_seq=2 ttl=64 time=12.957 ms
84 bytes from 192.168.10.2 icmp_seq=3 ttl=64 time=12.432 ms
84 bytes from 192.168.10.2 icmp_seq=4 ttl=64 time=11.820 ms
84 bytes from 192.168.10.2 icmp_seq=5 ttl=64 time=12.531 ms

PC1> trace 192.168.10.2 -P 1
trace to 192.168.10.2, 8 hops max (ICMP), press Ctrl+C to stop
 1   192.168.10.2   12.797 ms  9.772 ms  10.686 ms

PC1> trace 192.168.10.3 -P 1
trace to 192.168.10.3, 8 hops max (ICMP), press Ctrl+C to stop
 1   192.168.10.3   13.713 ms  13.101 ms  11.652 ms

`;